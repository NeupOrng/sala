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
        this.title = json.title ?? '';
        this.description = json.description ?? '';
        this.classId = json.classId ?? '';
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
            status: "draft"
        }
    }
}