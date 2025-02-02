import React, { useState } from 'react';

interface Topic {
  id: string;
  title: string;
  video_links: string[];
  pdf_path: string;
}

interface AccordionProps {
  unitName: string;
  unitOrder: number;
  topics: Topic[];
}

const Accordion: React.FC<AccordionProps> = ({ unitName, unitOrder, topics }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border rounded-lg mb-4">
      <div
        className="flex justify-between items-center p-4 cursor-pointer bg-gray-100 hover:bg-gray-200"
        onClick={toggleAccordion}
      >
        <h2 className="font-semibold">Unit {unitOrder}: {unitName}</h2>
        <span>{isOpen ? '-' : '+'}</span>
      </div>
      {isOpen && (
        <div className="p-4">
          {topics.length > 0 ? (
            topics.map(topic => (
              <div key={topic.id} className="mb-2">
                <h3 className="font-medium">{topic.title}</h3>
                <div className="flex flex-col">
                  {topic.video_links.map((link, index) => (
                    <a key={index} href={link} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                      Video {index + 1}
                    </a>
                  ))}
                  {topic.pdf_path && (
                    <a href={topic.pdf_path} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                      Download PDF
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No topics available for this unit.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Accordion; 