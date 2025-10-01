import { useForm, type FormContext } from "vee-validate";
import * as z from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { formatDateToStringForInputComponent } from "~/lib/date-utils";

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
        this.correctAnswer = this.contentJson.correctAnswer ?? -1;
    }

    get contentJson() {
        return JSON.parse(this.content);
    }

    getModel<T>(): T {
        if (this.type === "multiple-choice") {
            const mcq = new MultipleChoiceQuestionModelDto();
            mcq.values = this;
            return mcq as unknown as T;
        }
        return this as unknown as T;
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

export interface IQuestionModelDto {
    content: string;
    type: string;
}

export interface IMultipleChoiceQuestionModelDto extends IQuestionModelDto {
    text: string;
    options: string[];
    correctAnswer: number;
}

export class MultipleChoiceQuestionModelDto
    implements IMultipleChoiceQuestionModelDto
{
    content: string;
    type: string;
    text: string;
    options: string[];
    correctAnswer: number;

    constructor() {
        this.content = "";
        this.type = "multiple-choice";
        this.text = "";
        this.options = [];
        this.correctAnswer = -1;
    }

    set values(json: any) {
        this.content = json.content ?? "";
        this.type = json.type ?? "multiple-choice";
        try {
            const contentJson = JSON.parse(this.content || "{}");
            this.text = contentJson.text ?? "";
            this.options = Array.isArray(contentJson.options)
                ? contentJson.options
                : [];
            this.correctAnswer =
                this.options.indexOf(contentJson.correctAnswer) ?? -1;
        } catch (error) {
            console.error("Error parsing content JSON:", error);
            this.text = "";
            this.options = [];
            this.correctAnswer = -1;
        }
    }

    get isValid(): boolean {
        return this.validateMessage === "";
    }

    get validateMessage(): string {
        if (!this.text || this.text.trim().length === 0) {
            return "Question text is required.";
        }
        if (this.options.length < 2) {
            return "At least two options are required.";
        }
        if (
            this.options.some((option) => !option || option.trim().length === 0)
        ) {
            return "All options must be non-empty.";
        }
        if (
            this.correctAnswer === -1 ||
            this.options.includes(this.options[this.correctAnswer]) === false
        ) {
            return "A valid correct answer must be selected.";
        }
        return "";
    }

    getQuestionDto(quizId: string): QuestionDto {
        return new QuestionDto({
            quizId,
            questionId: "",
            content: JSON.stringify({
                text: this.text,
                options: this.options,
                correctAnswer: this.options[this.correctAnswer],
            }),
            type: "multiple-choice",
        });
    }

    get formContext(): FormContext<IMultipleChoiceQuestionModelDto> {
        const schema = toTypedSchema(
            z.object({
                type: z.literal("multiple-choice"),
                text: z
                    .string()
                    .refine((val) => this.text.trim().length > 0, {
                        message: "Question text is required.",
                    })
                    .default(""),
                options: z
                    .array(z.string().min(1, "Option cannot be empty"))
                    .refine((val) => this.options.length >= 2, {
                        message: "At least two options are required",
                    })
                    .default([]),
                correctAnswer: z
                    .number()
                    .default(-1)
                    .refine(
                        (val) =>
                            this.correctAnswer === -1 ||
                            this.options.includes(
                                this.options[this.correctAnswer]
                            ),
                        {
                            message: "A valid correct answer must be selected",
                        }
                    ),
            })
        );

        return useForm<IMultipleChoiceQuestionModelDto>({
            validationSchema: schema,
            initialValues: {
                content: this.content,
                type: this.type,
                text: this.text,
                options: this.options,
                correctAnswer: this.correctAnswer,
            },
        });
    }
}

export class QuestionModelDto implements IQuestionModelDto {
    content: string;
    type: string;

    constructor() {
        this.content = "";
        this.type = "multiple-choice";
    }

    set values(json: any) {
        this.content = json.content ?? "";
        this.type = json.type ?? "multiple-choice";
    }

    get values(): IQuestionModelDto {
        return {
            content: this.content,
            type: this.type,
        };
    }
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

    get startTimeInput(): string {
        return this.startTime.toISOString().slice(0, 16);
    }

    set startTimeInput(value: string) {}
}

export interface IQuizModelDto {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    classId: string;
    questions: IQuestionDto[];
}

export class QuizModelDto implements IQuizModelDto {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    classId: string;
    questions: QuestionDto[];
    status: string;
    quizId: string;

    constructor() {
        this.title = "";
        this.description = "";
        this.startTime = "";
        this.endTime = "";
        this.classId = "";
        this.status = "draft";
        this.questions = [];
        this.quizId = "";
    }

    set values(json: any) {
        this.title = json.title ?? "";
        this.description = json.description ?? "";
        this.startTime = formatDateToStringForInputComponent(
            json.startTime ?? new Date()
        );
        this.endTime = formatDateToStringForInputComponent(
            json.endTime ?? new Date()
        );
        this.questions = json.questions
            ? json.questions.map((value: any) => new QuestionDto(value))
            : [];
        this.classId = json.classId ?? "";
        this.status = json.status ?? "draft";
        this.quizId = json.quizId ?? "";
        this.formContext.setValues({
            title: this.title,
            description: this.description,
            startTime: this.startTime,
            endTime: this.endTime,
            questions: this.questions,
            classId: this.classId,
        });
    }

    get updateQuizRequestDto(): UpdateQuizRequestDto {
        return new UpdateQuizRequestDto({
            quizId: this.quizId,
            title: this.title,
            description: this.description,
            status: this.status,
            startTime: this.startTime,
            endTime: this.endTime,
            classId: this.classId,
            questions: this.questions,
        });
    }

    get formContext(): FormContext<IQuizModelDto> {
        const questionSchema = z.object({
            content: z.string().min(1, "Content is required"),
            type: z.enum(["multiple-choice", "true-false", "short-answer"], {
                errorMap: () => ({
                    message:
                        "Type must be one of multiple-choice, true-false, or short-answer",
                }),
            }),
        });
        const schema = toTypedSchema(
            z.object({
                title: z
                    .string()
                    .min(3, "Title must be at least 3 characters")
                    .max(100, "Title must be at most 100 characters"),
                description: z
                    .string()
                    .max(500, "Description must be at most 500 characters")
                    .optional(),
                classId: z.string().nonempty("Class is required"),
                startTime: z
                    .string()
                    .refine((date) => new Date(date) > new Date(), {
                        message: "Start time must be in the future",
                    }),
                endTime: z
                    .string()
                    .refine(
                        (date) => new Date(date) > new Date(this.startTime),
                        { message: "End time must be after start time" }
                    ),
                questions: z.array(questionSchema).default([]).optional(),
            })
        );
        return useForm<IQuizModelDto>({
            validationSchema: schema,
            initialValues: {
                title: "",
                description: "",
                classId: "",
                startTime: this.startTime,
                endTime: this.endTime,
                questions: [],
            },
        });
    }
}

export class UpdateQuizRequestDto {
    quizId: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    classId: string;
    status: string;
    questions: IQuestionDto[];

    constructor(json: any) {
        this.quizId = json.quizId;
        this.title = json.title;
        this.description = json.description;
        this.startTime = json.startTime;
        this.endTime = json.endTime;
        this.classId = json.classId;
        this.status = json.status;
        this.questions = json.questions
            ? json.questions.map((value: any) => new QuestionDto(value))
            : [];
    }

    get jsonString(): string {
        return JSON.stringify({
            quizId: this.quizId,
            title: this.title,
            description: this.description,
            startTime: new Date(this.startTime).toISOString(),
            endTime: new Date(this.endTime).toISOString(),
            classId: this.classId,
            status: this.status,
            questions: this.questions.map((q) => ({
                questionId: q.questionId,
                content: q.content,
                type: q.type,
            })),
        });
    }
}
