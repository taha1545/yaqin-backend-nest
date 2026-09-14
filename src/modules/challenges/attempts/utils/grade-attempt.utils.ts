import { BadRequestException } from '@nestjs/common'
import type { GradeAttemptInput, SubmittedAnswer, Question } from './types'
import { QuestionType } from 'generated/prisma/client'
import { ProgressStatus } from 'generated/prisma/client';


export function gradeAttempt({ questions, submittedAnswers, minPresent, lessonXp }: GradeAttemptInput) {
    //
    const questionMap = new Map(questions.map(question => [question.id, question]));
    const answers = [];
    let correctCount = 0;
    // answers 
    for (const submitted of submittedAnswers) {
        const question = questionMap.get(submitted.questionId);
        if (!question) throw new BadRequestException('Invalid question.');
        //
        const isCorrect = checkAnswer(question, submitted)
        if (isCorrect) correctCount++;
        //
        answers.push({
            questionId: submitted.questionId,
            optionId: submitted.optionId ?? null,
            answer: submitted.answer ?? null,
            isCorrect,
        })
    }
    // Calculate percentage and status
    const progress = Math.round((correctCount / questions.length) * 100)
    const passed = progress >= minPresent;
    const xpEarned = passed ? lessonXp : 0;
    //
    return {
        answers,
        correctCount,
        totalQuestions: questions.length,
        progress,
        passed,
        status: passed ? ProgressStatus.COMPLETED : ProgressStatus.FAILED,
        xpEarned,
    }
}


function checkAnswer(question: Question, submitted: SubmittedAnswer): boolean {
    switch (question.type) {
        //
        case QuestionType.SINGLE_CHOICE:
            return checkSingleChoice(
                question,
                submitted,
            )

        case QuestionType.TRUE_FALSE:
            return checkTextAnswer(
                question.correctAnswer,
                submitted.answer,
            )

        case QuestionType.SHORT_ANSWER:
            return checkTextAnswer(
                question.correctAnswer,
                submitted.answer,
            )

        default: throw new BadRequestException('Unsupported question type.')
    }
}

function checkSingleChoice(question: Question, submitted: SubmittedAnswer): boolean {
    if (!submitted.optionId) throw new BadRequestException('Option is required.');
    //
    const option = question.options.find(option => option.id === submitted.optionId);
    if (!option) throw new BadRequestException('Invalid option.');
    //
    return option.isCorrect
}

function checkTextAnswer(correctAnswer: string | null, submittedAnswer?: string): boolean {
    if (!submittedAnswer?.trim()) throw new BadRequestException('Answer is required.',);
    if (!correctAnswer?.trim()) return false;
    //
    return normalizeAnswer(submittedAnswer) === normalizeAnswer(correctAnswer)
}

function normalizeAnswer(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ')
}