import React from "react";
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, FacebookIcon, TwitterIcon, LinkedinIcon } from "react-share";

const ClipShare = ({ url, title, description }) => {
    return (
        <div className="flex space-x-3">
            <FacebookShareButton url={url} quote={title} hashtag="#quickclips">
                <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton url={url} title={title} hashtags={["quickclips"]}>
                <TwitterIcon size={32} round />
            </TwitterShareButton>
            <LinkedinShareButton url={url} title={title} summary={description} source="QuickClips">
                <LinkedinIcon size={32} round />
            </LinkedinShareButton>
        </div>
    );
};

export default ClipShare;
