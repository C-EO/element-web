/*
Copyright 2022 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { forwardRef, RefObject } from 'react';

import EditorStateTransfer from '../../../../utils/EditorStateTransfer';
import { WysiwygComposer } from './components/WysiwygComposer';
import { EditionButtons } from './components/EditionButtons';
import { useWysiwygEditActionHandler } from './hooks/useWysiwygEditActionHandler';
import { useEditing } from './hooks/useEditing';
import { useInitialContent } from './hooks/useInitialContent';

interface ContentProps {
    disabled: boolean;
}

const Content = forwardRef<HTMLElement, ContentProps>(
    function Content({ disabled }: ContentProps, forwardRef: RefObject<HTMLElement>) {
        useWysiwygEditActionHandler(disabled, forwardRef);
        return null;
    },
);

interface EditWysiwygComposerProps {
    disabled?: boolean;
    onChange?: (content: string) => void;
    editorStateTransfer: EditorStateTransfer;
}

export function EditWysiwygComposer({ editorStateTransfer, ...props }: EditWysiwygComposerProps) {
    const initialContent = useInitialContent(editorStateTransfer);
    const isReady = !editorStateTransfer || Boolean(initialContent);

    const { editMessage, endEditing, onChange, isSaveDisabled } = useEditing(initialContent, editorStateTransfer);

    return isReady && <WysiwygComposer
        initialContent={initialContent}
        onChange={onChange}
        onSend={editMessage}
        {...props}>
        { (ref) => (
            <>
                <Content disabled={props.disabled} ref={ref} />
                <EditionButtons onCancelClick={endEditing} onSaveClick={editMessage} isSaveDisabled={isSaveDisabled} />
            </>)
        }
    </WysiwygComposer>;
}
