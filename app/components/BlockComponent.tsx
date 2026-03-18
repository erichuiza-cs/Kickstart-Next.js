import React from "react";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import { Block } from "@/lib/types";

interface BlockComponentProps {
  block: Block;
  index: number;
  editableTags?: any;
}

const BlockComponent: React.FC<BlockComponentProps> = ({ block, index, editableTags }) => {
  const isImageLeft = block.layout === "image_left";

  return (
    <div
      key={block._metadata.uid}
      {...(editableTags && editableTags[`blocks__${index}`])}
      className={`flex flex-col md:flex-row items-center space-y-4 md:space-y-0 bg-white ${isImageLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
    >
      <div className="w-full md:w-1/2">
        {block.image ? (
          <Image
            key={`image-${block._metadata.uid}`}
            src={block.image.url}
            alt={block.image.title}
            width={200}
            height={112}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1200px"
            style={{ width: "100%", height: "auto" }}
            className="w-full"
            {...(block?.$ && block?.$.image)}
          />
        ) : null}
      </div>
      <div className="w-full md:w-1/2 p-4">
        {block.title ? (
          <h2
            className="text-2xl font-bold"
            {...(block?.$ && block?.$.title)}
          >
            {block.title}
          </h2>
        ) : null}
        {block.copy ? (
          <div
            {...(block?.$ && block?.$.copy)}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(block.copy) }}
            className="prose"
          />
        ) : null}
      </div>
    </div>
  );
};

export default BlockComponent;