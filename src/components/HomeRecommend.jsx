import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import colors from "../lib/colors";

import useUserRecoil from "../hooks/auth/useUserRecoil";
import useRecommendApi from "../hooks/api/useRecommendApi";
import useToast from "../hooks/useToast";

import ResultContainer from "./ResultContainer";
import StatuteContainer from "./StatuteContainer";

const RecommendStyle = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-bottom: 64px;
`;

const Title = styled.div`
  display: flex;

  justify-content: space-between;
  align-items: center;

  margin: 32px 0 16px 0;

  .left {
    font-size: 24px;
    color: ${colors.highlightColor};
  }
  .right {
    cursor: pointer;
    user-select: none;
  }
`;

const HomeRecommend = () => {
  const [articleList, setArticleList] = useState(null);
  const [statuteList, setStatuteList] = useState(null);

  const { user } = useUserRecoil();
  const recommendApi = useRecommendApi();
  const { ToastInfo } = useToast();

  useEffect(() => {
    const getRecommend = async () => {
      let res = await recommendApi.getCombinedRecommend();

      if (res) {
        setArticleList(res.result.slice(0, 3));

        const statuteRes = await recommendApi.getCombinedRecommend("statute");
        setStatuteList(statuteRes.result.slice(0, 5));

        return;
      }

      res = await recommendApi.getLogRecommend();

      if (res) {
        setArticleList(res.result.slice(0, 3));

        const statuteRes = await recommendApi.getLogRecommend("statute");
        setStatuteList(statuteRes.result.slice(0, 5));

        return;
      }

      res = await recommendApi.getBookmarkRecommend();

      if (res) {
        setArticleList(res.result.slice(0, 3));

        const statuteRes = await recommendApi.getLogRecommend("statute");
        setStatuteList(statuteRes.result.slice(0, 5));

        return;
      }

      ToastInfo("법률을 탐색하거나 북마크하면 관련 있는 법률이 추천 됩니다!");
    };

    if (user) {
      getRecommend();
    }
  }, [user]);

  return (
    <RecommendStyle>
      {articleList && (
        <>
          <Title>
            <div className="left">맞춤 법조항</div>
            <div className="right">
              <Link to="/recommends">더보기</Link>
            </div>
          </Title>
          <ResultContainer articleList={articleList} />
          <StatuteContainer statuteList={statuteList} />
        </>
      )}
    </RecommendStyle>
  );
};

export default HomeRecommend;
