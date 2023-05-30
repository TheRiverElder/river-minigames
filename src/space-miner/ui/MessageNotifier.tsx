import classNames from "classnames";
import { Component, CSSProperties, ReactNode } from "react";
import { int } from "../../libs/CommonTypes";
import ListenerManager from "../../libs/management/ListenerManager";
import IncrementNumberGenerator from "../../libs/math/IncrementNumberGenerator";
import "./MessageNotifier.scss";

export interface MessageNotifierProps {
    listeners: ListenerManager<string>;
    className?: string;
    style?: CSSProperties;
}

interface Message {
    uid: int;
    timestamp: number;
    content: string;
}

export interface MessageNotifierState {
    messages: Array<Message>;
}

export default class MessageNotifier extends Component<MessageNotifierProps, MessageNotifierState> {

    private uidGenerator = new IncrementNumberGenerator();

    constructor(props: MessageNotifierProps) {
        super(props);
        this.state = {
            messages: [],
        };
    }

    private readonly onMessage = (content: string) => {
        const message: Message = {
            uid: this.uidGenerator.generate(),
            timestamp: Date.now(),
            content,
        };
        this.setState(s => ({ messages: s.messages.concat(message) }));
        setTimeout(this.removeFirstMessage, 5000);
    };

    private mounted: boolean = false;

    componentDidMount(): void {
        this.mounted = true;
        this.props.listeners.add(this.onMessage);
    }

    componentWillUnmount(): void {
        this.props.listeners.remove(this.onMessage);
        this.mounted = false;
    }

    override render(): ReactNode {
        return (
            <div className={classNames("MessageNotifier", this.props.className)} style={this.props.style}>
                {this.state.messages.map(message => (
                    <div key={message.uid} className="message">
                        {message.content}
                    </div>
                ))}
            </div>
        );
    }

    private readonly removeFirstMessage = () => {
        if (this.mounted) this.setState(s => ({ messages: s.messages.slice(1) }));
    };
}