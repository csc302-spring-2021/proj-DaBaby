from sdcform.models import Section, SDCQuestion, Choice


def parse_question(question_dict, section, controller=None,
                   controller_answer_enabler=None):

    if "@title" in question_dict:
        text = question_dict["@title"]
    else:
        text = ""

    if "ResponseField" in question_dict:
        assert "Response" in question_dict["ResponseField"]
        type_key_lst = \
            question_dict["ResponseField"]["Response"].keys()
        type_key_lst = list(type_key_lst)
        while type_key_lst[0][0] == "@":
            del type_key_lst[0]
        assert len(type_key_lst) == 1
        if ["string"] == type_key_lst:
            q_type = "free-text"
        elif ["decimal"] == type_key_lst:
            # might change this later
            q_type = "integer"
        else:
            assert ["integer"] == type_key_lst
            # need a way to store max and min inclusive
            q_type = "integer"
    else:
        assert "ListField" in question_dict

        # Single vs multiple choice
        lf = question_dict["ListField"]
        li = lf["List"]["ListItem"]
        if isinstance(li, list):
            if "@maxSelections" in lf and str(lf["@maxSelections"]) == "0":
                q_type = "multiple-choice"
            else:
                q_type = "single-choice"
        else:
            q_type = "true-false"
            text = li["@title"]


    # controller_answer_enabler = None
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
        choice_dicts = \
            question_dict["ListField"]["List"]["ListItem"]
        if not isinstance(choice_dicts, list):
            choice_dicts = [choice_dicts]
        for choice_dict in choice_dicts:
            if "ListItemResponseField" in choice_dict:
                assert "Response" in \
                       choice_dict["ListItemResponseField"]
                type_key_lst = choice_dict[
                    "ListItemResponseField"]["Response"].keys()
                type_key_lst = list(type_key_lst)
                while type_key_lst[0][0] == "@":
                    del type_key_lst[0]
                assert len(type_key_lst) == 1
                if ["string"] == type_key_lst:
                    input_type = "str"
                elif ["decimal"] == type_key_lst:
                    # might change this later
                    input_type = "int"
                else:
                    assert ["integer"] == type_key_lst
                    # need a way to store max and min inclusive
                    input_type = "int"
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
