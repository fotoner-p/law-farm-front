import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";

import styled from "styled-components";

import colors from "../lib/colors";

import useUserRecoil from "../hooks/auth/useUserRecoil";
import useRecommendApi from "../hooks/api/useRecommendApi";

import ResultContainer from "../components/ResultContainer";
import SelectorButton from "../components/input/SelectorButton";

import useToast from "../hooks/useToast";
import StatuteContainer from "../components/StatuteContainer";

const RecommendsStyle = styled.div`
  max-width: 700px;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 64px;
`;

const Title = styled.h1`
  margin: 0 0 16px 0;
  font-weight: normal;
  color: ${colors.highlightColor};
  font-size: 48px;
`;

const Notice = styled.div`
  font-size: 36px;
  color: ${colors.fontGrey};
`;

const categoryKeys = {
  mixed: "mixed",
  log: "log",
  bookmark: "bookmark",
};

const categoryList = [
  {
    key: categoryKeys.mixed,
    name: "종합",
  },
  {
    key: categoryKeys.log,
    name: "기록 기반",
  },
  {
    key: categoryKeys.bookmark,
    name: "북마크 기반",
  },
];

const Recommends = () => {
  const [articleList, setArticleList] = useState(null);
  const [statuteList, setStatuteList] = useState(null);
  const [category, setCategory] = useState(categoryList[0].key);

  const { user } = useUserRecoil();
  const recommendApi = useRecommendApi();
  const { ToastFail } = useToast();

  useEffect(() => {
    const getRecommend = async () => {
      let res;
      let statuteRes;

      switch (category) {
        case categoryKeys.mixed:
          res = await recommendApi.getCombinedRecommend();
          statuteRes = await recommendApi.getCombinedRecommend("statute");
          break;
        case categoryKeys.log:
          res = await recommendApi.getLogRecommend();
          statuteRes = await recommendApi.getLogRecommend("statute");
          break;
        case categoryKeys.bookmark:
          res = await recommendApi.getBookmarkRecommend();
          statuteRes = await recommendApi.getBookmarkRecommend("statute");
          break;
        default:
          break;
      }

      if (res) {
        setArticleList(res.result);
        setStatuteList(statuteRes.result.slice(0, 5));
      } else {
        setArticleList(null);
        setStatuteList(null);
        ToastFail("북마크 혹은 열람 기록이 없습니다...");
      }
    };

    if (user) {
      getRecommend();
    }
  }, [user, category]);

  return (
    <RecommendsStyle>
      <Helmet>
        <title>맞춤 법률 - 로우팜</title>
      </Helmet>
      <Title>맞춤 법조항</Title>
      {user && (
        <SelectorButton
          categoryList={categoryList}
          handler={setCategory}
          category={category}
        />
      )}
      {user && statuteList && <StatuteContainer statuteList={statuteList} />}
      {user && articleList && <ResultContainer articleList={articleList} />}
      {user && !articleList && <Notice>결과가 존재하지 않습니다...</Notice>}
      {!user && <Notice>로그인을 해주시기 바랍니다</Notice>}
    </RecommendsStyle>
  );
};

export default Recommends;
