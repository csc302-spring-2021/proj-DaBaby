import React, {Component} from "react";
import {Field} from "react-final-form";
import {FormControl, FormGroup, FormLabel, FormText,} from "react-bootstrap";
import "./SDCSection.scss";
import "./Question.scss";

const Condition = ({when, is, children}) => (
	<Field name={when} subscription={{value: true}}>
		{({input: {value}}) => (String(value).match(is) ? children : null)}
	</Field>
);

class Question extends Component {
	render() {
		const {question} = this.props;
		// If the question controller answer is *, change it to a regular expression that accepts
		// at least one or more alphanumeric character
		if (question.controllerAnswerEnabler === "*")
			question.controllerAnswerEnabler = "[0-9A-Za-z]+";

		if (question.controllerAnswerEnabler === true) question.controllerAnswerEnabler = "true";

		// Depending on type of question render different ways
		switch (question.type) {
			// Single Choice Option
			case "single-choice":
				if (question.controllerID) {
					return (
						<Condition
							when={"filler" + question.controllerID}
							is={new RegExp(question.controllerAnswerEnabler)}
						>
							<div>
								<FormLabel className="title">
									{question.questionText}
								</FormLabel>
								<div className="radio">
									{/* Dynamically rendering all choices the question has */}
									{question.choices.map((option, index) => (
										<div key={index}>
											<FormLabel>
												<Field
													name={"filler" + question.id}
													component="input"
													type="radio"
													value={option.text}
												/>{" "}
												{option.text}
											</FormLabel>
										</div>
									))}
								</div>
							</div>
						</Condition>
					);
				} else {
					return (
						<div>
							<FormLabel className="title">{question.questionText}</FormLabel>
							<div className="radio">
								{/* Dynamically rendering all choices the question has */}
								{question.choices.map((option, index) => (
									<div key={index}>
										<FormLabel>
											<Field
												name={"filler" + question.id}
												component="input"
												type="radio"
												value={option.text}
											/>{" "}
											{option.text}
										</FormLabel>
									</div>
								))}
							</div>
						</div>
					);
				}

			// Multiple Choice Option
			case "multiple-choice":
				if (question.controllerID) {
					return (
						<Condition
							when={"filler" + question.controllerID}
							is={new RegExp(question.controllerAnswerEnabler)}
						>
							<div>
								<FormLabel className="title">
									{question.questionText}
								</FormLabel>
								<div className="checkbox">
									{/* Dynamically rendering all choices the question has */}
									{question.choices.map((option, index) => (
										<div key={index}>
											<FormLabel>
												<Field
													name={"filler" + question.id}
													component="input"
													type="checkbox"
													value={option.text}
												/>{" "}
												{option.text}
											</FormLabel>
										</div>
									))}
								</div>
							</div>
						</Condition>
					);
				} else {
					return (
						<div>
							<FormLabel className="title">{question.questionText}</FormLabel>
							<div className="checkbox">
								{/* Dynamically rendering all choices the question has */}
								{question.choices.map((option, index) => (
									<div key={index}>
										<FormLabel>
											<Field
												name={"filler" + question.id}
												component="input"
												type="checkbox"
												value={option.text}
											/>{" "}
											{option.text}
										</FormLabel>
									</div>
								))}
							</div>
						</div>
					);
				}

			// Free text option
			case "free-text":
				// If question has a controller id, render it depending on whether controller has right answer
				if (question.controllerID) {
					return (
						<Condition
							when={"filler" + question.controllerID}
							is={new RegExp(question.controllerAnswerEnabler)}
						>
							<Field
								name={"filler" + question.id}
							>
								{({input, meta}) => (
									<FormGroup controlId={this.key}>
										<FormLabel className="title">
											{question.questionText}
										</FormLabel>
										<FormControl
											{...input}
											type="text"
											placeholder="Enter answer here"
											isInvalid={meta.error && meta.touched}
										/>
										<FormText data-testid="caseIdValidation">
											{meta.error && meta.touched && <span>{meta.error}</span>}
										</FormText>
									</FormGroup>
								)}
							</Field>
						</Condition>
					);
				} else {
					return (
						<Field
							name={"filler" + question.id}
						>
							{({input, meta}) => (
								<FormGroup controlId={this.key}>
									<FormLabel className="title">
										{question.questionText}
									</FormLabel>
									<FormControl
										{...input}
										type="text"
										placeholder="Enter answer here"
										isInvalid={meta.error && meta.touched}
									/>
									<FormText data-testid="caseIdValidation">
										{meta.error && meta.touched && <span>{meta.error}</span>}
									</FormText>
								</FormGroup>
							)}
						</Field>
					);
				}

			// Integer Option
			case "integer":
				if (question.controllerID) {
					return (
						<Condition
							when={"filler" + question.controllerID}
							is={new RegExp(question.controllerAnswerEnabler)}
						>
							<div>
								<FormLabel className="title">
									{question.questionText}
								</FormLabel>
								<div className="integer">
									<FormLabel>
										<Field
											name={"filler" + question.id}
											component="input"
											type="number"
											value={question.text}
											min="0"
										/>{" "}
										{question.text}
									</FormLabel>
								</div>
							</div>
						</Condition>
					);
				} else {
					return (
						<div>
							<FormLabel className="title">{question.questionText}</FormLabel>
							<div className="integer">
								<FormLabel>
									<Field
										name={"filler" + question.id}
										component="input"
										type="number"
										value={question.text}
										min="0"
									/>{" "}
									{question.text}
								</FormLabel>
							</div>
						</div>
					);
				}

			// True/false option
			case "true-false":
				if (question.controllerID) {
					return (
						<Condition
							when={"filler" + question.controllerID}
							is={new RegExp(question.controllerAnswerEnabler)}
						>
							<div>
								<FormLabel className="title">
									{question.questionText}
								</FormLabel>
								<div className="checkbox">
									<FormLabel>
										<Field
											name={"filler" + question.id}
											component="input"
											type="checkbox"
											value={question.questionText}
										/>{" "}
										{question.questionText}
									</FormLabel>
								</div>
							</div>
						</Condition>
					);
				} else {
					return (
						<div>
							<FormLabel className="title">{question.questionText}</FormLabel>
							<div className="checkbox">
								<FormLabel>
									<Field
										name={"filler" + question.id}
										component="input"
										type="checkbox"
									/>{" "}
									{question.questionText}
								</FormLabel>
							</div>
						</div>
					);
				}
		}
	}
}

export default Question;
