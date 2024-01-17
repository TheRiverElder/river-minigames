
import { ReactNode } from 'react';
import './LoadingDialog.scss';

export interface LoadingDialogProps {
    text?: ReactNode;
}

export default function LoadingDialog(props: LoadingDialogProps) {
    return (
        <div className='LoadingDialog'>
            <div className='icon-loading'/>
            <div className='text'>{props.text || "..."}</div>
        </div>
    );
}