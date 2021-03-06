import QuizModel from "./model.js";
import { updateObjectKeys } from "../../api/general.js";
export default {
  /**
   * Creates a new quiz and adds it to the database
   */
  createQuiz: async (req, res) => {
    const userId = req.session.userId;
    if (userId == null) {
      return;
    }
    const quizData = req.body.quiz;
    const quiz = new QuizModel({
      name: quizData.name,
      description: quizData.description,
      questions: quizData.questions,
      difficulty: 0,
      perfects: quizData.perfects,
      attempts: quizData.attempts,
      author: userId
    });
    /**
     * Save a new quiz to the database
     */
    quiz.save(function (err) {
      if (err) return res.send(500, { error: err });
      req.session.save();
      res.status(201);
    });
  },
  /**
   * Gets a list of quizzes from the database alongside the authors info
   */
  fetchQuizzes: async (req, res) => {
    let limit = req.query.limit;
    let sort = req.query.sort;
    let order = -1;
    if (req.query.order) {
      order = req.query.order === "desc" ? -1 : 1;
    }
    const quizzes = await QuizModel.find()
      .sort({ [sort]: order })
      .limit(parseInt(limit))
      .populate("author")
      .exec();
    res.status(201);
    res.send(quizzes);
  },
  /**
   * Fetches the specified quiz from the DB
   */
  fetchQuiz: async (req, res) => {
    const quiz = await QuizModel.findOne({ name: req.params.name })
      .populate("author")
      .exec();
    if (quiz) {
      res.status(201);
      res.send(quiz);
    } else {
      res.status(404);
    }
  },
  /**
   * Updates the data of an existing quiz
   */
  updateQuiz: async (req, res) => {
    const quiz = await QuizModel.findOne({ name: req.params.name }).exec();
    if (quiz) {
      if (req.body.data.incrementAttempts) {
        quiz.attempts += 1;
      }
      if (req.body.data.incrementPerfects) {
        quiz.perfects += 1;
      }
      updateObjectKeys(quiz, req.body.data);
      quiz.save();
      res.status(200);
    } else {
      res.status(404);
    }
  }
};
