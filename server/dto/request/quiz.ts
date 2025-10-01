import { QuestionDto } from "~/model/quiz";
import { QuizStatusEnum, Quizzes } from "~/server/schema";
export interface ICreateQuizRequest {
    title: string;
    description: string;
    classId: string;
    startTime: Date;
    endTime: Date;
}

export class CreateQuizRequest implements ICreateQuizRequest {
    title: string;
    description: string;
    classId: string;
    startTime: Date;
    endTime: Date;

    constructor(json: any) {
        this.title = json.title ?? "";
        this.description = json.description ?? "";
        this.classId = json.classId ?? "";
        this.startTime = new Date(json.startTime);
        this.endTime = new Date(json.endTime);
    }

    public getInsertPayload(teacherId: string): typeof Quizzes.$inferInsert {
        return {
            teacherId,
            title: this.title,
            description: this.description,
            classId: this.classId,
            startTime: this.startTime,
            endTime: this.endTime,
            status: "draft",
        };
    }
}

export interface ICreateQuestionRequest {
    quizId: string;
    content: string;
    type: string;
}

export class UpdateQuestionRequest {
    questionId: string;
    content: string;
    type: string;

    constructor(json: any) {
        this.questionId = json.questionId ?? "";
        this.content = json.content ?? "";
        this.type = json.type ?? "multiple-choice";
    }
}

export class CreateQuestionRequest {
    content: string;
    type: string;

    constructor(json: any) {
        this.content = json.content ?? "";
        this.type = json.type ?? "multiple-choice";
    }
}

export class UpdateQuizRequest {
    classId: string;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    status: keyof typeof QuizStatusEnum;
    questions: Array<CreateQuestionRequest | UpdateQuestionRequest>;

    constructor(json: any) {
        this.classId = json.classId ?? "";
        this.title = json.title ?? "";
        this.description = json.description ?? "";
        this.startTime = new Date(json.startTime);
        this.endTime = new Date(json.endTime);
        this.status = json.status ?? "draft";
        this.questions = (json.questions ?? []).map(
            (q: any) => {
                if (q.questionId || q.questionId !== "") {
                    return new UpdateQuestionRequest(q);
                }
                return new CreateQuestionRequest(q);
            }
        );
    }
}
