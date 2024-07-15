'use client';
import React, { useState } from 'react';
import { IndicateLoading } from '@components/components/atomic/IndiacteLoading';

export function CommentsDemo() {
    return (
        <>
            <h2>Leave a comment</h2>
            <IndicateLoading />
        </>
    );
}
