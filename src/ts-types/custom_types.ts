export declare type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
};


export type InputType = React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: Scalars["String"];
    value?: Scalars["String"] | Scalars["Int"] | Scalars["Boolean"];
    name: Scalars["String"];
    type?: "text" | "password" | "textarea" | Scalars["String"];
    placeholder?: Scalars["String"];
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    className?: Scalars["String"];
    error?: Scalars["String"] | any;
};

