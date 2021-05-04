import React from "react";
import _ from "lodash";
import Option from "./Option";
import Question from "../../models/question";
import ErrorMessage from "../ErrorMessage";
class NewQuestion extends React.Component {
  state = { question: _.cloneDeep(Question), errorMessages: {} };

  componentDidMount = () => {
    this.reset();
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps.questionId !== this.props.questionId) {
      this.reset();
    }
  };
  /**
   * Sets the question value to its original value if it already exists
   * or to a new question if it does not
   */
  reset = () => {
    this.setState({
      question: this.props.questions[this.props.questionId - 1]
        ? _.cloneDeep(this.props.questions[this.props.questionId - 1])
        : _.cloneDeep(Question),
    });
  };
  /**
   * Renders a list of options based on the max amount of options a question can have
   * @returns {JSX}
   */
  renderOptions = () => {
    return [...Array(3).keys()].map((optionId, index) => {
      /**
       * Updates the question description when the specified input changes
       * @param {*} e
       */
      const onDescriptionChange = (e) => {
        const newOptions = this.state.question.options;
        newOptions[index].option = e.target.value;
        this.setState((prevState) => ({
          question: {
            ...prevState.question,
            options: newOptions,
          },
        }));
      };
      /**
       * Updates and validates the current options checkbox data
       * also ensures only one option is ever ticked as the answer
       * @param {Object} e the input event
       * @returns
       */
      const onIsAnswerChange = (e) => {
        const newOptions = this.state.question.options;
        //Dont allow the user to uncheck an active option
        if (e.target.checked === false && newOptions[index].isAnswer === true) {
          return;
        }
        newOptions[index].isAnswer = e.target.checked;
        this.setState(
          (prevState) => ({
            question: {
              ...prevState.question,
              options: newOptions,
            },
          }),
          () => {
            //Uncheck all other checked values
            newOptions.forEach((option, key) => {
              if (key !== index) {
                if (option.isAnswer === true) {
                  const questionOption = this.state.question.options;
                  questionOption[key].isAnswer = false;
                  this.setState((prevState) => ({
                    question: {
                      ...prevState.question,
                      options: newOptions,
                    },
                  }));
                }
              }
            });
          }
        );
      };
      const errorMessage = () => {
        return this.state.errorMessages &&
          this.state.errorMessages["question" + index]
          ? this.state.errorMessages["question" + index]
          : "";
      };

      return (
        <Option
          key={index}
          index={optionId}
          value={this.state.question.options[optionId]}
          onDescriptionChange={onDescriptionChange}
          onIsAnswerChange={onIsAnswerChange}
          questionId={this.props.questionId}
          errorMessage={errorMessage()}
        />
      );
    });
  };
  /**
   * Validates the form befor submission
   * @returns {Boolean}
   */
  validateForm = () => {
    var errorCount = 0;
    var errorMessages = {};
    //No Question name passed
    if (!this.state.question.description) {
      errorMessages.noQuestion = "Please provide a value for your question";
      errorCount++;
    }
    //Check if any of the fields are null
    this.state.question.options.forEach((option, key) => {
      if (!option.option) {
        errorMessages["question" + key] =
          "Please provide a valid input for Question" + (key + 1);
        errorCount++;
      }
    });
    this.setState({
      errorMessages: errorMessages,
    });
    return errorCount === 0;
  };
  /**
   * Renders an error message if the input field is null
   * @returns {JSX}
   */
  renderErrorMessage = () => {
    return <ErrorMessage message={this.state.errorMessages.noQuestion} />;
  };
  render() {
    return (
      <React.Fragment>
        <label htmlFor="question">Question {this.props.questionId}</label>
        {this.renderErrorMessage()}
        <textarea
          placeholder="The question is..."
          name="question"
          value={this.state.question.description}
          className="border"
          onChange={(e) => {
            this.setState((prevState) => ({
              question: {
                ...prevState.question,
                description: e.target.value,
              },
            }));
          }}
        />
        {this.renderOptions()}
        <div className="flex spcae-x-2">
          <button
            className="bg-success border p-2"
            onClick={() => {
              if (this.validateForm()) {
                this.props.addQuestion(this.state.question);
                this.props.loadNextSlide();
              }
            }}
          >
            Next
          </button>
          <button
            className="bg-danger border p-2"
            onClick={() => {
              this.props.addQuestion(this.state.question); //save it anyway
              this.props.loadPreviousSlide();
            }}
          >
            Previous
          </button>
        </div>
      </React.Fragment>
    );
  }
}
export default NewQuestion;