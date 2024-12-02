import ChatHeader from "../component/chatHeader/ChatHeader";
import ChatRoom from "../component/chatRoom/ChatRoom";
import Sidebar from "../component/layout/sidebar/Sidebar";
import MyChats from "../component/myChats/MyChats";
import NoChatSelected from "../component/noChatSelected/NoChatSelected";
import { StyledBadge } from "../component/styledComponent/StyledComponent";
import API from "../config/Api";
import { handleGetRequest, handlePostRequest } from "../config/DataService";
import { useAppContext } from "../context/AppContext";
import { loginValidationSchema, signupValidationSchema } from "../validation/Validation";
import { useNavigate } from "react-router-dom";
const PageIndex = {
    MyChats,
    StyledBadge,
    NoChatSelected,
    ChatHeader,
    Sidebar,
    ChatRoom,

    useAppContext,
    handleGetRequest,
    handlePostRequest,
    API,

    signupValidationSchema,
    loginValidationSchema,
    useNavigate
}

export default PageIndex;