import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import useDocumentApi from "../hooks/api/useDocumentApi";
import colors from "../lib/colors";
import StatuteContainer from "./StatuteContainer";

const Title = styled.div`
  font-size: 30px;
  //padding-left: 20px;
  margin-bottom: 18px;
  color: ${colors.highlightColor};
`;

const ResultContainer = styled.div`
  margin: 24px 0;
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const ResultItem = styled.div`
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  padding: 20px;
  box-shadow: 0 2px 10px -5px black;
  border-radius: 20px;

  margin-bottom: 30px;
  width: 100%;
  //height: 300px;

  .title {
    color: ${colors.highlightColor};

    font-size: 24px;
  }

  .content {
    display: flex;
    .paragraphCount {
      margin-left: 8px;
      color: ${colors.fontGrey};
    }
  }
`;

const DetailLink = styled.div`
  position: absolute;
  right: 20px;
  top: 50%;
  font-size: 24px;
  transform: translateY(-50%);
  color: ${colors.highlightColor};
`;

const RelateContents = ({ docKey, size = 5, target = "article" }) => {
  const [document, setDocument] = useState(null);
  const [statute, setStatute] = useState(null);
  const { relatedDocument, relatedStatute } = useDocumentApi();

  useEffect(() => {
    const requestRelated = async () => {
      const resDocument = await relatedDocument(docKey, target, size);
      setDocument(resDocument);
      const resStatute = await relatedStatute(docKey, target, 7);
      setStatute(resStatute);
    };

    if (docKey) {
      requestRelated();
    }
  }, [docKey, target, size]);

  return (
    <ResultContainer>
      <Title>관련 법령</Title>
      {statute && <StatuteContainer statuteList={statute.result} />}
      <Title>관련 조항</Title>
      {document &&
        document.result.map((val, idx) => (
          <ResultItem key={idx}>
            <Link to={`/${target}/@${val.name}`}>
              <div className="title">{val.name}</div>
              <div className="content">
                <div className="type">
                  {val.about.text.length > 0
                    ? val.about.text.match(/(\((.*?)\)| 삭제 <(.*?)>)/g)[0]
                    : val.about.text}
                </div>
                <div className="paragraphCount">
                  {val.about.paragraphs.length > 0
                    ? `*${val.about.paragraphs.length}개의 항 존재*`
                    : ""}
                </div>
              </div>
              <DetailLink>〈</DetailLink>
            </Link>
          </ResultItem>
        ))}
    </ResultContainer>
  );
};

export default RelateContents;
