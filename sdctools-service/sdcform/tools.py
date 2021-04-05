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
        if "Response" not in question_dict["ResponseField"]:
            raise ParseError("Invalid XML format! Expected <ResponseField> to have child <Response>")

        type_key_lst = list(question_dict["ResponseField"]["Response"].keys())
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
        list_item = list_field["List"]["ListItem"]
        if isinstance(list_item, list):
            if "@maxSelections" in list_field and str(list_field["@maxSelections"]) == "0":
                q_type = "multiple-choice"
            else:
                q_type = "single-choice"
        else:
            q_type = "true-false"
            text = list_item["@title"]
    else:
        raise ParseError("Invalid XML Format! Expected <Question> to have child <ResponseField> or <ListField>.")

    sdc_question = SDCQuestion(type=q_type, text=text,
                               controller=controller,
                               controller_answer_enabler=controller_answer_enabler,
                               section=section, order=question_dict["@order"])
    models.append(sdc_question)

    # Answer independent controller
    if "ChildItems" in question_dict:
        children = question_dict["ChildItems"]["Question"]
        if not isinstance(children, list):
            children = [children]
        for child in children:
            parse_question(child, section, sdc_question, "*")

    if q_type in {"single-choice", "multiple-choice"}:
        choice_dicts = question_dict["ListField"]["List"]["ListItem"]
        if not isinstance(choice_dicts, list):
            choice_dicts = [choice_dicts]
        for choice_dict in choice_dicts:
            if "ListItemResponseField" in choice_dict:
                if "Response" not in choice_dict["ListItemResponseField"]:
                    raise ParseError("Invalid XML Format! Expected <ListItemResponseField> to have child <Response>")

                type_key_lst = list(choice_dict["ListItemResponseField"]["Response"].keys())
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
            choice = Choice(text=text, input_type=input_type,
                            sdcquestion=sdc_question, order=choice_dict["@order"])
            models.append(choice)

            # Register option-specific dependencies:
            if "ChildItems" in choice_dict:
                children = choice_dict["ChildItems"]["Question"]
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

    section = Section(name=name, sdcform=sdc_form, order=section_dict["@order"])
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
