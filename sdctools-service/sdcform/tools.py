from sdcform.models import Section, SDCQuestion, Choice


class ParseError(Exception):
    pass


def parse_question(question_dict, section, controller=None,
                   controller_answer_enabler=None):
    if "@title" in question_dict:
        text = question_dict["@title"]
    else:
        text = ""

    if "ResponseField" in question_dict:
        if "Response" not in question_dict["ResponseField"]:
            raise ParseError("Expect ResponseField to have key Response")

        type_key_lst = list(question_dict["ResponseField"]["Response"].keys())
        while type_key_lst[0][0] == "@":
            del type_key_lst[0]

        if len(type_key_lst) != 1:
            raise ParseError("type_key_lst should have length 1")

        if ["string"] == type_key_lst:
            q_type = "free-text"
        elif ["decimal"] == type_key_lst or ["integer"] == type_key_lst:
            q_type = "integer"
        else:
            raise ParseError("Unknown type_key_lst: %s" % str(type_key_lst))
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
        raise ParseError("Expected: ResponseField / ListField")

    sdc_question = SDCQuestion(type=q_type, text=text,
                               controller=controller,
                               controller_answer_enabler=
                               controller_answer_enabler,
                               section=section)
    sdc_question.save()

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
                    raise ParseError("Expecting ListItemResponseField to have child Response")

                type_key_lst = list(choice_dict["ListItemResponseField"]["Response"].keys())
                while type_key_lst[0][0] == "@":
                    del type_key_lst[0]

                if len(type_key_lst) != 1:
                    raise ParseError("type_key_lst should have length 1")

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
                            sdcquestion=sdc_question)
            choice.save()

            # Register option-specific dependencies:
            if "ChildItems" in choice_dict:
                children = choice_dict["ChildItems"]["Question"]
                if not isinstance(children, list):
                    children = [children]
                for child in children:
                    parse_question(child, section, sdc_question, text)


def parse_section(section_dict, sdc_form):
    if "@title" in section_dict:
        name = section_dict["@title"]
    else:
        name = ""

    section = Section(name=name, sdcform=sdc_form)
    section.save()

    question_dicts = section_dict["ChildItems"]["Question"]
    if not isinstance(question_dicts, list):
        question_dicts = [question_dicts]
    for question_dict in question_dicts:
        parse_question(question_dict, section)
