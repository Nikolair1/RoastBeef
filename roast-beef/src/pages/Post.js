import { useState, React } from "react";
import {
  Post,
  PostContents,
  PostTextL,
  PostTextR,
  PostHeaderText,
  PostUsername,
  PostTitle,
  PostTags,
  CreateComments,
  CommentButton,
  VoteButton,
  VoteCount,
} from "./style";
import fightSymbol from "../images/fightSymbol.png";
import ArrowUnfilled from "../images/arrow-unfilled.png";
import ArrowFilled from "../images/arrow-filled.png";
import { cookies } from "./SignIn";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase-config.js";
import { __RouterContext } from "react-router";

const DisplayCommenting = (props) => {
  const {
    username,
    postuser,
    taggeduser,
    postcomments,
    setNewTag,
    setComments,
    newTag,
    updateComments,
  } = props;
  let turn = postcomments.length;
  if (turn % 2 === 0) {
    if (username === postuser) {
      return (
        <div id="postPadding">
          <CreateComments
            type="text"
            placeholder="Enter Roast"
            onChange={(event) => {
              setNewTag(event.target.value);
            }}
          ></CreateComments>
          <CommentButton
            onClick={(event) => {
              let c = postcomments;
              c.push(newTag);
              setComments(c);
              updateComments(newTag);
            }}
          >
            Roast
          </CommentButton>
        </div>
      );
    } else {
      return <p />;
    }
  } else {
    if (username === taggeduser) {
      return (
        <div id="postPadding">
          <CreateComments
            type="text"
            placeholder="Enter Roast"
            onChange={(event) => {
              setNewTag(event.target.value);
            }}
          ></CreateComments>
          <CommentButton
            onClick={(event) => {
              let c = postcomments;
              c.push(newTag);
              setComments(c);
              updateComments(newTag);
            }}
          >
            Roast
          </CommentButton>
        </div>
      );
    } else {
      return <p />;
    }
  }
};

const LikeButtonImg = (props) => {
  if (props.liked) {
    return (
      <img src={ArrowFilled} alt="ArrowFilled" width="20" height="21"></img>
    );
  } else {
    return (
      <img src={ArrowUnfilled} alt="ArrowUnfilled" width="20" height="21"></img>
    );
  }
};

function PostD({
  username,
  taggedUser,
  postTitle,
  postTags,
  postComments,
  postVote_Tagged,
  postVote_User,
}) {
  const [liked, setLiked] = useState(null);
  const [newTag, setNewTag] = useState("");
  const [comments, setComments] = useState(postComments);
  const postCollectionRef = collection(db, "posts");
  const [userVotes, setUserVotes] = useState(postVote_User);
  const [taggedVotes, setTaggedVotes] = useState(postVote_Tagged);

  async function pushLikes(votes, tvotes) {
    let docID;
    setLiked(!liked);
    const h = query(postCollectionRef, where("Title", "==", postTitle));
    const querySnapshot2 = await getDocs(h);
    querySnapshot2.forEach((doc) => {
      docID = doc.id;
    });

    const docIDRef = doc(db, "posts", docID);

    await updateDoc(docIDRef, {
      Vote_Tagged: tvotes,
      Vote_User: votes,
    });
  }
  var votes = userVotes;
  var tvotes = taggedVotes;

  async function updateComments(newTag) {
    console.log("shr");
    let docID;
    setLiked(!liked);
    const h = query(postCollectionRef, where("Title", "==", postTitle));
    const querySnapshot2 = await getDocs(h);
    querySnapshot2.forEach((doc) => {
      docID = doc.id;
    });
    const postRef = doc(db, "posts", docID);

    await updateDoc(postRef, {
      Comments: comments,
      createdAt: Date.now()
    });
  }

  return (
    <div className="postD">
      <Post>
        {/* PostHeader -> @usernames + vote counters + upvote buttons that increase the vote count + title + tags*/}
        <PostHeaderText>
          <PostTitle>{postTitle}</PostTitle>
          <VoteCount>{votes.length}</VoteCount>
          <VoteButton
            onClick={(event) => {
              
              votes = votes.filter(function (value) {
                return value !== cookies.get("user");
              });
              votes.push(cookies.get("user"));
              
              tvotes = tvotes.filter(function (value) {
                return value !== cookies.get("user");
              });
              setUserVotes(votes);
              setTaggedVotes(tvotes);
              pushLikes(votes, tvotes);
            }}
          >
            <LikeButtonImg
              liked = {Array.from(votes).includes(cookies.get("user"))}
            ></LikeButtonImg>
          </VoteButton>
          <PostUsername>{username}</PostUsername>
          <fightSymbolStyle>
            <img
              src={fightSymbol}
              alt="fightSymbol"
              width="50"
              height="50"
            ></img>
          </fightSymbolStyle>
          <PostUsername>{taggedUser}</PostUsername>
          <VoteButton
            onClick={(event) => {
              votes = votes.filter(function (value) {
                return value !== cookies.get("user");
              });
              tvotes = tvotes.filter(function (value) {
                return value !== cookies.get("user");
              });
              tvotes.push(cookies.get("user"));
              setUserVotes(votes);
              setTaggedVotes(tvotes);
              pushLikes(votes, tvotes);
            }}
          >
            <LikeButtonImg
              liked = {Array.from(tvotes).includes(cookies.get("user"))}
            ></LikeButtonImg>
          </VoteButton>
          <VoteCount>{tvotes.length}</VoteCount>
          <PostTags>{" " + postTags}</PostTags>
        </PostHeaderText>
        {/* post contents: text*/}
        <PostContents>
          {comments.map((post, index) => {
            if (index % 2 === 0) {
              return <PostTextL>{comments[index]}</PostTextL>;
            } else {
              return <PostTextR>{comments[index]}</PostTextR>;
            }
          })}
        </PostContents>{" "}
        <DisplayCommenting
          username={cookies.get("user")}
          postuser={username}
          taggeduser={taggedUser}
          postcomments={comments}
          newTag={newTag}
          setNewTag={setNewTag}
          setComments={setComments}
          updateComments={updateComments}
        ></DisplayCommenting>
      </Post>
    </div>
  );
}

export default PostD;
