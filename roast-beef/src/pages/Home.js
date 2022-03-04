import { useState, useEffect, React, useRef } from "react";
import "./HomePage.css";
import "./HomeCss.css";
import {db} from "../firebase-config";
import Logo from "../images/logo.png";
import Popup from "./Popup";
import {
  NavBar,
  NavPadding,
  LandingPage,
  Button,
  LandingPageWrapper,
  Post,
  PostContents,
  Text,
  NextButton,
  NickyButton,
  SearchBar,
  DDButton,
} from "../pages/style";
import PostD from "./Post";
import "./HomeCss.css";
import "./Popup";
import { collection, getDocs } from "firebase/firestore";
import { async } from "@firebase/util";

const SearchbarDropdown = (props) => {
  const { options, onInputChange } = props;
  const ulRef = useRef();
  const inputRef = useRef();
  useEffect(() => {
      inputRef.current.addEventListener('click', (event) => {
        event.stopPropagation();
        ulRef.current.style.display = 'flex';
        onInputChange(event);
      });
      document.addEventListener('click', (event) =>{
        ulRef.current.style.display = 'none';
      });
  }, []);
  return (
    <div className="outerleft">
      <SearchBar
        type="text"
        placeholder="Search Here"
        ref={inputRef}
        onChange={onInputChange}
      />{" "}
      <p />
      <ul id="results" ref={ulRef}>
        {options.map((option, index) => {
          return (
            <DDButton
              className="list-group-item list-group-item-action"
              key={index}
              onClick={(e) => {
                inputRef.current.value = option;
                }}
            >
              {option}
            </DDButton> 
          );
        })}
      </ul>
    </div>
  );
};

const defaultOptions = [];
defaultOptions.push(`#political`);
defaultOptions.push(`#sports`);
defaultOptions.push(`#basketball`);
defaultOptions.push(`#business`);
defaultOptions.push(`#entertainment`);
defaultOptions.push(`#arts`);
defaultOptions.push(`#history`);
defaultOptions.push(`#casual`);
defaultOptions.push(`#ucla`);
defaultOptions.push(`#computerscience`);
defaultOptions.push(`#wordle`);
defaultOptions.push(`#globle`);
defaultOptions.push(`#handshakes`);

for (let i = 0; i < 10; i++) {
  defaultOptions.push(`tag ${i}`);
}

const Home = () => {

  const [posts, setPosts] = useState([]);
  const postsColRef = collection(db, "posts");


  useEffect(()=> {
    const getPosts = async () => {
      const data = await getDocs(postsColRef);
      setPosts(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
    }
    getPosts();
  }, []);


  const postsCollectionRef = collection(db, "posts");
  const [buttonPopup, setButtonPopup] = useState(false);

  const [options, setOptions] = useState([]);
  const onInputChange = (event) => {
    console.log(event.target.value);
    setOptions(
      defaultOptions.filter((option) => option.includes(event.target.value))
    );
  };

  return (
    <LandingPage>
      <Popup trigger={buttonPopup} setTrigger={setButtonPopup}></Popup>
      <NavBar>
        <br></br>
        <SearchbarDropdown options={options} onInputChange={onInputChange} />
        <div className="outerright">
          <div>
            <NickyButton onClick={() => setButtonPopup(true)}>
              {" "}
              Create Post{" "}
            </NickyButton>
          </div>
        </div>
        <div className="stayPutHome">
          <a href="/" className="NavLogo">
            <marquee behavior="alternate" width="300">
              <img
                src={Logo}
                alt="Logo"
                align="left"
                width="200"
                height="133"
              ></img>
            </marquee>
          </a>
        </div>
      </NavBar>{" "}
      <p />
      <NavPadding></NavPadding> <p />

      {posts.map((post) => {
        return (
          <PostD
            username={post.User}
            taggerUser={post.TaggedUser}
            postText={post.Text}
            postTitle={post.Title}
          ></PostD>
        );
        
      })}
      <p></p>
    </LandingPage>
  );
};
export default Home;
