/* eslint-disable @typescript-eslint/no-explicit-any */

export type VideoSource = "youtube" | "facebook";

export interface TFood {
    _id: string;
    title: string;
    category: string;
    videoSource: VideoSource;
    videoUrl: string;
    duration: string;

    createdBy: any;

    createdAt?: Date;
    updatedAt?: Date;
}