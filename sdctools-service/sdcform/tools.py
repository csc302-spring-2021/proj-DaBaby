from sdcform.models import Section, SDCQuestion, Choice
import xmltodict
from xml.parsers.expat import ExpatError


class ParseError(Exception):
    pass


def parse_xml(xmlString, sdc_form):
    models_to_save = []
    xml_start_index = xmlString.find("<")

    if xml_start_index < 0:
        raise ParseError('Uploaded file is not a valid XML file!')
    xmlString = xmlString[xml_start_index:]
    try:
        xml_dict = xmltodict.parse(xmlString[xml_start_index:])
    except ExpatError:
        raise ParseError('Uploaded file is not a valid XML file!')

    if "SDCPackage" in xml_dict:
        xml_dict = xml_dict["SDCPackage"]

    if "XMLPackage" in xml_dict:
        xml_dict = xml_dict["XMLPackage"]

    try:
        section_dicts = xml_dict["FormDesign"]["Body"]["ChildItems"]["Section"]
    except KeyError:
        raise ParseError("Invalid XML Format! Expected <XMLPackage> or <SDCPackage> to have child <FormDesign>,"
                         "which should have child <Body>, which should have child <ChildItems>, which should have"
                         "child <ChildItems>, which should have child <Section>.")
    if not isinstance(section_dicts, list):
        section_dicts = [section_dicts]

    for section_dict in section_dicts:
        models_to_save.extend(parse_section(section_dict, sdc_form))

    return models_to_save


def parse_question(question_dict, section, controller=None,
                   controller_answer_enabler=None):
    models = []
    if "@title" in question_dict:
        text = question_dict["@title"]
    else:
        text = ""

    if "ResponseField" in question_dict:
        try:
            type_key_lst = list(question_dict["ResponseField"]["Response"].keys())
        except KeyError:
            raise ParseError("Invalid XML format! Expected <ResponseField> to have child <Response>")
        while type_key_lst[0][0] == "@":
            del type_key_lst[0]

        if len(type_key_lst) != 1:
            raise ParseError("Invalid XML format! Expected <Response> to only contain one tag "
                             "with tag name as the data type!")

        if ["string"] == type_key_lst:
            q_type = "free-text"
        elif ["decimal"] == type_key_lst or ["integer"] == type_key_lst:
            q_type = "integer"
        else:
            q_type = "free-text"
    elif "ListField" in question_dict:
        # Single vs multiple choice
        list_field = question_dict["ListField"]
        try:
            list_item = list_field["List"]["ListItem"]
        except KeyError:
            raise ParseError("Invalid XML format! Expected <ListField> to contain tag <List>, which should contain"
                             "tag <ListItem>.")
        if isinstance(list_item, list):
            if "@maxSelections" in list_field and str(list_field["@maxSelections"]) == "0":
                q_type = "multiple-choice"
            else:
                q_type = "single-choice"
        else:
            q_type = "true-false"
            if "@title" in list_item:
                text = list_item["@title"]
            else:
                text = ""
    else:
        raise ParseError("Invalid XML Format! Expected <Question> to have child <ResponseField> or <ListField>.")

    if "@order" in question_dict:
        order = question_dict["@order"]
    else:
        order = 1
    sdc_question = SDCQuestion(type=q_type, text=text,
                               controller=controller,
                               controller_answer_enabler=controller_answer_enabler, section=section, order=order)
    models.append(sdc_question)

    # Answer independent controller
    if "ChildItems" in question_dict:
        try:
            children = question_dict["ChildItems"]["Question"]
        except KeyError:
            raise ParseError("Invalid XML format! Expected <ChildItems> tag in a question to contain tag <Question>.")
        if not isinstance(children, list):
            children = [children]
        for child in children:
            parse_question(child, section, sdc_question, "*")

    if q_type in {"single-choice", "multiple-choice"}:
        try:
            choice_dicts = question_dict["ListField"]["List"]["ListItem"]
        except KeyError:
            raise ParseError("Invalid XML format! Expected a single choice/multiple choice question to have tag"
                             "<ListField>, which should have tag <List>, which should have tag <ListItem>.")
        if not isinstance(choice_dicts, list):
            choice_dicts = [choice_dicts]
        for choice_dict in choice_dicts:
            if "ListItemResponseField" in choice_dict:
                try:
                    type_key_lst = list(choice_dict["ListItemResponseField"]["Response"].keys())
                except KeyError:
                    raise ParseError("Invalid XML Format! Expected <ListItemResponseField> to have child <Response>")
                while type_key_lst[0][0] == "@":
                    del type_key_lst[0]

                if len(type_key_lst) != 1:
                    raise ParseError("Invalid XML format! Expected <Response> to only contain one tag "
                                     "with tag name as the data type!")

                if ["decimal"] == type_key_lst or ["integer"] == type_key_lst:
                    input_type = "int"
                else:
                    input_type = "str"
            else:
                input_type = None

            if "@title" in choice_dict:
                text = choice_dict["@title"]
            else:
                text = ""

            if "@order" in choice_dict:
                order = choice_dict["@order"]
            else:
                order = 1

            choice = Choice(text=text, input_type=input_type,
                            sdcquestion=sdc_question, order=order)
            models.append(choice)

            # Register option-specific dependencies:
            if "ChildItems" in choice_dict:
                try:
                    children = choice_dict["ChildItems"]["Question"]
                except KeyError:
                    raise ParseError("Invalid XML Format! Expected <ChildItems> in an option-specific dependency to "
                                     "contain tag <Question>.")
                if not isinstance(children, list):
                    children = [children]
                for child in children:
                    models.extend(parse_question(child, section, sdc_question, text))

    return models


def parse_section(section_dict, sdc_form):
    models = []
    if "@title" in section_dict:
        name = section_dict["@title"]
    else:
        name = ""

    if "@order" in section_dict:
        order = section_dict["@order"]
    else:
        order = 1

    section = Section(name=name, sdcform=sdc_form, order=order)
    models.append(section)
    try:
        question_dicts = section_dict["ChildItems"]["Question"]
    except KeyError:
        raise ParseError("Invalid XML Format! Expected <Section> to have child <ChildItems>, "
                         "and <ChildItems> to have child <Question>")
    if not isinstance(question_dicts, list):
        question_dicts = [question_dicts]
    for question_dict in question_dicts:
        models.extend(parse_question(question_dict, section))

    return models
