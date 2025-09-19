import { ClassDto, type IClassDto } from "./class";
import { TeacherDto, type ITeacherDto } from "./teacher";

export interface IQuestionDto {
    quizId: string;
    questionId: string;
    content: string;
    type: string;
}
export class QuestionDto implements IQuestionDto {
    quizId: string;
    questionId: string;
    content: string;
    type: string;
    text: string;
    options: string[];
    correctAnswer: number;

    constructor(json: any) {
        this.quizId = json.quizId;
        this.content = json.content ?? "{}";
        this.type = json.type;
        this.questionId = json.questionId;
        this.text = this.contentJson.text ?? "";
        this.options = this.contentJson.options ?? [];
        this.correctAnswer = this.contentJson ?? -1;
    }

    get contentJson() {
        return JSON.parse(this.content);
    }
}

export interface IQuizDto {
    quizId: string;
    title: string;
    description: string;
    status: string;
    startTime: Date;
    endTime: Date;
    class: IClassDto;
    teacher: ITeacherDto;
    questions: IQuestionDto[];
}

export class QuizDto implements IQuizDto {
    quizId: string;
    title: string;
    description: string;
    status: string;
    startTime: Date;
    endTime: Date;
    class: ClassDto;
    teacher: TeacherDto;
    questions: QuestionDto[];

    constructor(json: any) {
        this.quizId = json.quizId;
        this.title = json.title;
        this.description = json.description;
        this.status = json.status;
        this.startTime = new Date(json.startTime);
        this.endTime = new Date(json.endTime);
        this.class = new ClassDto(json.class);
        this.teacher = new TeacherDto(json.teacher);
        this.questions = json.questions
            ? json.questions.map((value: any) => new QuestionDto(value))
            : [];
    }

    get duration(): string {
        const diffMs = this.endTime.getTime() - this.startTime.getTime();
        const diffMins = Math.floor(diffMs / 1000 / 60);
        const hours = Math.floor(diffMins / 60);
        const minutes = diffMins % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }

    get startTimeForDisplay(): string {
        if (!this.startTime || isNaN(this.startTime.getTime())) {
            return "Invalid Date";
        }
        return this.startTime.toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }
}
