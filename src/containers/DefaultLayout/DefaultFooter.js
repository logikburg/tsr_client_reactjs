import React, { Component } from 'react';
import ChatBot, { Loading } from 'react-simple-chatbot';
//import PropTypes from 'prop-types';
//import { Route, Redirect } from 'react-router'
//import AmCharts from "@amcharts/amcharts3-react";
//const searchingValue = { cri: {} };
// const respondTime = 3.0;
// const randomRespondTime = (Math.random() * 3).toFixed(2);
// const randomPercentage = ((Math.random() * 1) + 99).toFixed(2);
// const brandPrimary = '#20a8d8';
// const brandSuccess = '#4dbd74';
// const brandInfo = '#63c2de';
// const brandWarning = '#f8cb00';
// const brandDanger = '#f86c6b';
var commentValue = "";

// const steps = [
//   {
//     id: '0',
//     message: 'Welcome to react chatbot!',
//     trigger: '1',
//   },
//   {
//     id: '1',
//     message: 'Bye!',
//     end: true,
//   },
// ];

class ChatBotSubComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      result: '',
      trigger: false,
    };
  }
}
// class StartNew extends ChatBotSubComponent {
//   render() {
//     return (<button className="btn btn-success" onClick={(event) => { this.props.onClick(event); this.props.triggerNextStep(); console.log(event.target) }}>Start a New Chat</button>);
//   }
// }

// class GoToNewRequest extends ChatBotSubComponent {
//   componentWillMount() {
//     const self = this;
//     const { step, steps, previousStep } = this.props;
//     searchingValue["cri"]["category"] = {};
//     searchingValue["cri"]["code"] = steps["selectedResult"].value;
//     this.search();
//   }
//   search() {
//     fetch("http://t1-chrischin:8080/api/v1/raw/" + searchingValue["big-cat"] + "/search",
//       {
//         /*method:'GET'*/

//         method: 'post',
//         headers: {
//           'Accept': 'application/json, text/plain, */*',
//           'Content-Type': 'application/json',
//           'Origin': window.location.origin,
//           'TSRAuth': "xlNIOEWONXVLSDFOiuLSKNLIUAD",
//           "X-Requested-With": "XMLHttpRequest"
//         },
//         body: JSON.stringify(
//           {
//             criteria: searchingValue["cri"],
//             options: {
//               offset: 10,
//               limit: 10
//             }
//           }
//         )
//       }
//     ).then(blob => blob.json())
//       .then((data, other) => {
//         console.log(other);
//         var _data = [{
//           title: "New Linux Server",
//           name: "new_linux_server",
//           components: [{
//             type: "text",
//             name: "hostname",
//             label: "Host",
//           },
//           {
//             type: "text",
//             name: "filesystem",
//             label: "Filesystem",
//             canMore: true
//           }, {
//             type: "text",
//             name: "fs-size",
//             label: "Size [in MB]",
//             canMore: true
//           },
//           {
//             type: "text",
//             name: "permisson(user:group)",
//             label: "perm",
//             canMore: true
//           }
//           ],
//           canMore: true
//         }];
//         console.log(_data);
//         this.setup(window.location.hash.replace("#", ""), _data);
//       })
//       .catch(e => {
//         var _data = [{
//           title: "New Linux Server",
//           name: "new_linux_server",
//           components: [{
//             type: "text",
//             name: "hostname",
//             label: "Host",
//           },
//           {
//             type: "text",
//             name: "filesystem",
//             label: "Filesystem",
//             canMore: true
//           }, {
//             type: "text",
//             name: "fs-size",
//             label: "Size [in MB]",
//             canMore: true
//           },
//           {
//             type: "text",
//             name: "permisson(user:group)",
//             label: "perm",
//             canMore: true
//           }
//           ],
//           canMore: true
//         }];
//         console.log(_data);
//         this.setup(window.location.hash.replace("#", ""), _data);
//         return e;
//       });

//   }
//   redirect(path, data) {
//     if (window.location.hash.replace("#", "") == path) {
//       this.props.parentCallBack("newrequest", { config: data });
//       this.props.triggerNextStep();
//       return (
//         <Redirect from={path} to={{
//           pathname: "#/request/new4/new"
//         }} />)
//     }
//     else return "";
//   }
//   setup(path, data) {
//     this.setState({ updateTime: new Date(), path: path, config: data });
//   }
//   render() {
//     return this.state.updateTime ? this.redirect(this.state.path, this.state.config) :
//       (<ul>
//         <li></li>
//       </ul>
//       )
//   }
// }

class UserCommentComponent extends ChatBotSubComponent {

  updateComment() {
    var user = JSON.parse(localStorage.getItem('user'));

    fetch("http://t1-chrischin:8080/api/v1/tsr/comments",
      {
        /*method:'GET'*/

        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
          'TSRAuth': "xlNIOEWONXVLSDFOiuLSKNLIUAD",
          "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify(
          {
            user_profile: user,
            user_comments: commentValue,
          }
        )
      }
    ).then(blob => blob.json())
      .catch(e => {
        return e;
      });

  }
  setup(data) {
    options.splice(0, options.length);

    data.map((cat) => {
      options.push({
        value: "label=" + cat.label, label: cat.label, trigger: "serversearch"
      })
    })


    this.props.triggerNextStep();
  }
  componentWillMount() {
    //const self = this;
    const { steps } = this.props;
    const searchValue = steps["selectedResult"] && steps["selectedResult"].value ? steps["selectedResult"].value.toLowerCase() : steps["userinput"].value.toLowerCase();
    let patt = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
    let re = new RegExp(patt);
    lang = lang === "" ? re.test(searchValue) ? "tc" : "en" : lang;

    console.log("Comments: " + searchValue);
    commentValue = searchValue;
    this.updateComment();

    if (
      (searchValue.indexOf("shit") >= 0 || searchValue.indexOf("fuck") >= 0) ||
      (searchValue.indexOf("食屎") >= 0 || searchValue.indexOf("頂") >= 0)
    ) {
      lang = re.test(searchValue) ? "tc" : "en";
      var response = conversation["foul-lang"][lang]

      this.props.triggerNextStep({ value: response[Math.floor(Math.random() * response.length)], trigger: "userresponse" });
    }
    else if (searchValue.indexOf("no") >= 0 || searchValue.trim() === "88" || searchValue.trim() === "88" || searchValue.trim() === "再見" || searchValue.trim() === "bye" || searchValue.trim() === "拜") {
      lang = re.test(searchValue) ? "tc" : lang !== "" ? lang : 'en';
      this.props.triggerNextStep({ value: conversation["bye-comment"][lang], trigger: "byecomment" });
    }
    else {
      lang = re.test(searchValue) ? "tc" : "en";
      this.props.triggerNextStep({ value: conversation["ask-comment-reply"][lang], trigger: "usercommmentreply" });
    }
  }

  render() {
    //const { trigger, loading, result } = this.state;

    return (
      <div>
        (<div className="dbpedia"><Loading /></div>)
      </div>
    );
  }
}

const options = []
let lang = "";
let conversation = {
  "good-morning": {
    "en": "Good morning!",
    "tc": "早晨!"
  },
  "good-afternoon": {
    "en": "Good afternoon!",
    "tc": "午安!"
  },
  "good-evening": {
    "en": "Good evening!",
    "tc": "晚安!"
  },
  "ask-comment-reply": {
    "en": "Thank you for your comments. Any More?",
    "tc": "謝謝你的意見, 還有沒有其他？"
  },
  "ask-comment": {
    "en": "Your comments are valuable to us. Any suggestions?",
    "tc": "你的意見很重要，有什麼建議呢?"
  },
  "help-question": {
    "en": "How can I help you?",
    "tc": "請問我有什麼幫到你?"
  },
  "appreicate-help": {
    "en": "I'm appreciate to help you. May I know what you want?",
    "tc": "我很高興你來找我,請問我有什麼幫到你?"
  },
  "package-request": {
    "en": "Package Request",
    "tc": "封包請求"
  },
  "standard-request": {
    "en": "Standard Request",
    "tc": "標準請求"
  },
  "other-question": {
    "en": "Other question",
    "tc": "其他請求"
  },
  "area-question": {
    "en": "Which area do you need?",
    "tc": "請問是哪一方面呢?"
  },
  "request-question": {
    "en": "Which request do you need?",
    "tc": "請問是哪一種請求呢?"
  },
  "request-found": {
    "en": "I think you would perfer below service.",
    "tc": "相信以下服務適合你。"
  },
  "still-learning": {
    "en": "Sorry, I'm still learning. Could you tell me what you perfer?",
    "tc": "親，我還在學習中，請問你是需要哪一種服務呢?"
  },
  "foul-lang": {
    "en": ["I don’t understand!", "Sorry, I am trying to help you.", "If you insist.", "Please, calm down."],
    "tc": ["我不明白你說什麼!", "親, 我在盡力協助你中。", "請問你需要什麼?", "親, 我想你需要一點空間冷靜一下。"]
  },
  "redirect-newrequest": {
    "en": "Okay! I redirect you to new request form",
    "tc": "明白，我將帶你到新請求的表格去。"
  },
  "bye": {
    "en": "Thanks for using this channel.",
    "tc": "謝謝使用我的服務。希望滿意這次服務，再見。"
  },
  "bye-comment": {
    "en": "Thank you. Have a nice day. Bye Bye.",
    "tc": "謝謝，祝你有愉快的一天，再見。"
  },
  "make-request": {
    "en": "Make a new request",
    "tc": "建立請求"
  },
  "query-request": {
    "en": "Query a request",
    "tc": "查詢請求"
  },
  "query-stat": {
    "en": "Query a statistic",
    "tc": "查詢數據資訊"
  }
}
class DefaultFooter extends Component {
  constructor(props) {
    super(props);
    this.lastStep = "userinput";
    //this.com;
    this.state = {
      steps: [
        {
          id: '0',
          message: (new Date()).getHours() < 12 ?
            lang != "" ? conversation["good-morning"][lang] : conversation["good-morning"]["en"] :
            (new Date()).getHours() < 18 ?
              lang !== "" ? conversation["good-afternoon"][lang] : conversation["good-afternoon"]["en"] :
              lang !== "" ? conversation["good-evening"][lang] : conversation["good-evening"]["en"],
          trigger: 'usercomment',
        },
        {
          id: 'usercomment',
          message: conversation["ask-comment"]["en"],
          trigger: 'userinput'
        },
        {
          id: 'userinput',
          user: true,
          trigger: "usercommenthandle",
          validator: (value) => {
            if ((value.trim().length === 0)) {
              return 'Please type something.';
            }
            return true;
          }
        },
        {
          id: 'usercommenthandle',
          component: <UserCommentComponent ref={(el) => this.com = el} />,
          delay: 1,
          replace: true,
          waitAction: true,
          asMessage: true,
        },
      ],
      chatbotOpened: false
    }
    this.toggleChatbot = this.toggleChatbot.bind(this);
  }

  toggleChatbot(opened) {
    console.log(opened);
    this.setState({
      chatbotOpened: opened
    })
  }


  render() {
    const style = {
      headerTitle: {
        height: "56px",
        padding: "5px 10px",
        lineHeight: "46px",
        background: "#4dbd74"
      },
      headerTitleFont: {
        lineHeight: "46px",
      },
      headerTitleImg: {
        height: "36px",
        verticalAlign: "middle",
        marginRight: "5px"
      },
      bubbleStyle: {
        background: "#FFF",
        color: "black",
        maxWidth: "100%",
        padding: "5px 12px"
      },
      rootStyle: {
        color: "white"
      },
      minimizeButton: {
        position: "absolute",
        right: "15px",
        top: "0",
      },
      submitButtonStyle: {
        fill: "#4dbd74"
      }
    }
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    var user = JSON.parse(localStorage.getItem('user'));
    return (
      <div>
        <span></span>
        <span className="ml-auto">Supported by <a href="">HA HOIT&HI</a></span>
        {/*
        <ChatBot
          ref={(el) => this.chatbot = el}
          steps={this.state.steps}
          floating={true}
          botAvatar="assets/img/avatars/robot.jpg"
          userAvatar={user.avatar}
          floatImg="img/TIRA.png"
          headerComponent={
            (
              <div style={style.headerTitle}>
                <h4 style={style.headerTitleFont}><img src='assets/img/TIRA.png' style={style.headerTitleImg} /> <b>TIRA </b></h4>
                <a style={style.minimizeButton} onClick={(event) => this.toggleChatbot(false)}>
                  <span className="fa fa-window-minimize"></span>
                </a>
              </div>)}
          customStyle={{ border: "none", background: "transparent", boxShadow: "none" }}
          bubbleStyle={style.bubbleStyle}
          style={style.rootStyle}
          contentStyle={style.rootStyle}
          opened={this.state.chatbotOpened}
          toggleFloating={(obj) => this.toggleChatbot(obj.opened)}
          submitButtonStyle={style.submitButtonStyle}
        />
 */}
      </div>
    );
  }
}
export default DefaultFooter;
