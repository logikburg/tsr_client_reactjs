import React, { Component } from 'react';
import ChatBot, { Loading } from 'react-simple-chatbot';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router'
import { sysConfig } from "../../_config";

//import AmCharts from "@amcharts/amcharts3-react";
const searchingValue = { cri: {} };
var commentValue = "";
const respondTime = 3.0;
const randomRespondTime = (Math.random() * 3).toFixed(2);
const randomPercentage = ((Math.random() * 1) + 99).toFixed(2);
const brandPrimary = '#20a8d8';
const brandSuccess = '#4dbd74';
const brandInfo = '#63c2de';
const brandWarning = '#f8cb00';
const brandDanger = '#f86c6b';

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
ChatBotSubComponent.propTypes = {
  steps: PropTypes.object,
  triggerNextStep: PropTypes.func,
};

ChatBotSubComponent.defaultProps = {
  steps: undefined,
  triggerNextStep: undefined,
};
class Message extends ChatBotSubComponent {
  render() {
    console.log(this.props);
    return (<span>{this.props.previousStep.value}</span>)
  }
}
class StartNew extends ChatBotSubComponent {
  render() {
    return (<button className="btn btn-success" onClick={(event) => { this.props.onClick(event); this.props.triggerNextStep(); console.log(event.target) }}>Start a New Chat</button>);
  }
}
class GoToNewRequest extends ChatBotSubComponent {
  componentWillMount() {
    const self = this;
    const { step, steps, previousStep } = this.props;
    searchingValue["cri"]["category"] = {};
    searchingValue["cri"]["code"] = steps["selectedResult"].value;
    this.search();
  }
  search() {
    fetch("http://t1-chrischin:8080/api/v1/raw/" + searchingValue["big-cat"] + "/search",
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
            criteria: searchingValue["cri"],
            options: {
              offset: 10,
              limit: 10
            }
          }
        )
      }
    ).then(blob => blob.json())
      .then((data, other) => {
        console.log(other);
        var _data = [{
          title: "New Linux Server",
          name: "new_linux_server",
          components: [{
            type: "text",
            name: "hostname",
            label: "Host",
          },
          {
            type: "text",
            name: "filesystem",
            label: "Filesystem",
            canMore: true
          }, {
            type: "text",
            name: "fs-size",
            label: "Size [in MB]",
            canMore: true
          },
          {
            type: "text",
            name: "permisson(user:group)",
            label: "perm",
            canMore: true
          }
          ],
          canMore: true
        }];
        console.log(_data);
        this.setup(window.location.hash.replace("#", ""), _data);
      })
      .catch(e => {
        var _data = [{
          title: "New Linux Server",
          name: "new_linux_server",
          components: [{
            type: "text",
            name: "hostname",
            label: "Host",
          },
          {
            type: "text",
            name: "filesystem",
            label: "Filesystem",
            canMore: true
          }, {
            type: "text",
            name: "fs-size",
            label: "Size [in MB]",
            canMore: true
          },
          {
            type: "text",
            name: "permisson(user:group)",
            label: "perm",
            canMore: true
          }
          ],
          canMore: true
        }];
        console.log(_data);
        this.setup(window.location.hash.replace("#", ""), _data);
        return e;
      });

  }
  redirect(path, data) {
    if (window.location.hash.replace("#", "") == path) {
      this.props.parentCallBack("newrequest", { config: data });
      this.props.triggerNextStep();
      return (
        <Redirect from={path} to={{
          pathname: "#/request/new4/new"
        }} />)
    }
    else return "";
  }
  setup(path, data) {
    this.setState({ updateTime: new Date(), path: path, config: data });
  }
  render() {
    return this.state.updateTime ? this.redirect(this.state.path, this.state.config) :
      (<ul>
        <li></li>
      </ul>
      )
  }
}
class ServerSearch extends ChatBotSubComponent {

  search() {
    fetch("http://t1-chrischin:8080/api/v1/raw/" + searchingValue["big-cat"] + "/search",
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
            criteria: searchingValue["cri"],
            options: {
              offset: 10,
              limit: 10
            }
          }
        )
      }
    ).then(blob => blob.json())
      .then(data => {
        this.setup(data);
      })
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
    const self = this;
    const { step, steps, previousStep } = this.props;
    const searchValue = steps["selectedResult"] && steps["selectedResult"].value ? steps["selectedResult"].value.toLowerCase() : steps["userinput"].value.toLowerCase();
    let patt = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
    let re = new RegExp(patt);
    lang = lang == "" ? re.test(searchValue) ? "tc" : "en" : lang;
    if (((searchValue.indexOf("make") >= 0 && searchValue.indexOf("request") >= 0) || searchValue.indexOf("make request") >= 0) ||
      (searchValue.indexOf("建立請求") >= 0 || searchValue.indexOf("需要請求") >= 0)
    ) {
      lang = re.test(searchValue) ? "tc" : "en";
      options.splice(0, options.length);
      options.push({ value: "package-request", label: conversation["package-request"][lang], trigger: "serversearch" });
      options.push({ value: "standard-request", label: conversation["standard-request"][lang], trigger: "serversearch" });
      options.push({ value: "other-question", label: conversation["other-question"][lang], trigger: "otherinput" });
      this.lastStep = "selectedResult"
      this.props.triggerNextStep({ value: conversation["request-question"][lang], trigger: "responseInput" });
    } else if (
      (searchValue.toLowerCase().indexOf("yes") >= 0 || searchValue.toLowerCase().indexOf("hello") >= 0) ||
      (searchValue.indexOf("你好") >= 0 || searchValue.indexOf("早晨") >= 0
        || searchValue.indexOf("係") >= 0 || searchValue.indexOf("安") >= 0)
    ) {
      lang = re.test(searchValue) ? "tc" : "en";
      options.splice(0, options.length);
      this.props.triggerNextStep({ value: conversation["appreicate-help"][lang], trigger: "userresponse" });
    }
    else if (
      (searchValue.indexOf("shit") >= 0 || searchValue.indexOf("fuck") >= 0) ||
      (searchValue.indexOf("食屎") >= 0 || searchValue.indexOf("頂") >= 0)
    ) {
      lang = re.test(searchValue) ? "tc" : "en";
      var response = conversation["foul-lang"][lang]

      this.props.triggerNextStep({ value: response[Math.floor(Math.random() * response.length)], trigger: "userresponse" });
    }
    else if (searchValue.indexOf("-request") >= 0) {
      searchingValue["big-cat"] = searchValue;
      options.splice(0, options.length);
      options.push({ value: "label=eHR", label: "eHR", trigger: "serversearch" });
      options.push({ value: "label=Windows", label: "Unix\Linux", trigger: "serversearch" });
      this.props.triggerNextStep({ value: conversation["area-question"][lang], trigger: "responseInput" });
      //this.search();
    }
    else if (searchValue.indexOf("label=") >= 0) {
      options.splice(0, options.length);
      searchingValue["cri"] = searchingValue["cri"] ? searchingValue["cri"] : {};
      searchingValue["cri"] = {
        label: searchValue.replace("label=", "")
      }
      options.push({ value: "cat=win001", label: "Account Creation", trigger: "serversearch" });
      options.push({ value: "cat=lin001", label: "Server Creation", trigger: "serversearch" });
      this.props.triggerNextStep({
        value:
          conversation["redirect-newrequest"][lang] + "\n" + conversation["request-found"][lang], trigger: "responseInput"
      });
      //this.search();
    } else if (searchValue.indexOf("cat=") >= 0) {
      this.props.triggerNextStep({ value: conversation["bye"][lang], trigger: "bye2newrequest" });
    } else if (searchValue.trim() == "88" || searchValue.trim() == "再見" || searchValue.trim() == "bye" || searchValue.trim() == "byebye" || searchValue.trim() == "goodbye" || searchValue.trim() == "拜" || searchValue.trim() == "拜拜") {
      lang = re.test(searchValue) ? "tc" : lang != "" ? lang : "en";
      this.props.triggerNextStep({ value: conversation["bye"][lang], trigger: "bye" });
    }
    else {
      lang = re.test(searchValue) ? "tc" : "en";
      options.splice(0, options.length);
      options.push({ value: "make-request", label: conversation["make-request"][lang], trigger: "serversearch" });
      options.push({ value: "query-request", label: conversation["query-request"][lang], trigger: "serversearch" });
      this.props.triggerNextStep({ value: conversation["still-learning"][lang], trigger: "responseInput" });
    }
  }

  render() {
    const { trigger, loading, result } = this.state;

    return (
      <div>
        (<div className="dbpedia"><Loading /></div>)
      </div>
    );
  }
}

class UserCommentComponent extends ChatBotSubComponent {

  updateComment() {
    var user = JSON.parse(localStorage.getItem('user'));


    //fetch("http://t1-chrischin:8080/api/v1/tsr/comments",
    fetch(sysConfig.API_TEST_PREFIX + "/tsr/comments",
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
    const self = this;
    const { step, steps, previousStep } = this.props;
    const searchValue = steps["selectedResult"] && steps["selectedResult"].value ? steps["selectedResult"].value.toLowerCase() : steps["userinput"].value.toLowerCase();
    let patt = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
    let re = new RegExp(patt);
    lang = lang == "" ? re.test(searchValue) ? "tc" : "en" : lang;

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
    else if (searchValue.trim() == "88" || searchValue.trim() == "再見" || searchValue.trim() == "bye" || searchValue.trim() == "byebye" || searchValue.trim() == "goodbye" || searchValue.trim() == "拜" || searchValue.trim() == "拜拜") {
      lang = re.test(searchValue) ? "tc" : lang != "" ? lang : "en";
      this.props.triggerNextStep({ value: conversation["bye-comment"][lang], trigger: "byecomment" });
    }
    else {
      lang = re.test(searchValue) ? "tc" : "en";
      this.props.triggerNextStep({ value: conversation["ask-comment-reply"][lang], trigger: "usercommmentreply" });
    }
  }

  render() {
    const { trigger, loading, result } = this.state;

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
class HABot extends Component {
  constructor(props) {
    super(props);
    this.lastStep = "userinput";
    //this.com;
    this.state = {
      steps: [
        {
          id: 'start-new',
          message: (new Date()).getHours() < 12 ?
            lang != "" ? conversation["good-morning"][lang] : conversation["good-morning"]["en"] :
            (new Date()).getHours() < 18 ?
              lang != "" ? conversation["good-afternoon"][lang] : conversation["good-afternoon"]["en"] :
              lang != "" ? conversation["good-evening"][lang] : conversation["good-evening"]["en"],
          trigger: 'usercomment'
        },
        {
          id: 'usercomment',
          message: conversation["ask-comment"]["en"],
          trigger: 'userinput'
        },
        {
          id: 'usercommmentreply',
          message: conversation["ask-comment-reply"]["en"],
          trigger: 'userinput'
        },
        {
          id: '2',
          message: conversation["help-question"]["en"],
          trigger: 'userinput'
        },
        {
          id: 'userinput',
          user: true,
          trigger: "usercommenthandle",
          validator: (value) => {
            if ((value.trim().length == 0)) {
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
        {
          id: 'otherinput',
          message: conversation["help-question"]["en"],
          trigger: 'userinput'
        },
        {
          id: 'serversearch',
          component: <ServerSearch ref={(el) => this.com = el} />,
          delay: 1,
          replace: true,
          waitAction: true,
          asMessage: true,
        },
        {
          id: 'responseInput',
          delay: 1000,
          message: ({ previousValue, steps }) => previousValue,
          trigger: "selectedResult"
        },
        {
          id: 'userresponse',
          delay: 1000,
          message: ({ previousValue, steps }) => previousValue,
          trigger: "userinput"
        },
        {
          id: 'selectedResult',
          options: options,
        },
        {
          id: 'bye2newrequest',
          message: ({ previousValue, steps }) => previousValue,
          trigger: "newrequest2"
        },
        {
          id: 'newrequest2',
          component: <GoToNewRequest parentCallBack={(name, data) => this.props.parentCallBack(name, data)} />,
          waitAction: true,
          replace: true,
          trigger: "end-message-start-new"
        },
        {
          id: 'bye',
          message: ({ previousValue, steps }) => previousValue,
          trigger: "end-message-start-new"
        },
        {
          id: 'byecomment',
          message: ({ previousValue, steps }) => previousValue,
          trigger: "end-message-start-new"
        },
        {
          id: 'end-message-start-new',
          component: <StartNew chatbot={this.chatbot} onClick={(event) => { while (this.chatbot.content.firstChild) { this.chatbot.content.removeChild(this.chatbot.content.firstChild); } }} />,
          waitAction: true,
          trigger: "start-new"
        }
      ],
      chatbotOpened: false
    }
    this.toggleChatbot = this.toggleChatbot.bind(this);
  }

  getRespondTimeStatus(rt, rrt) {
    if (rrt > (rt / 5) * 5) {
      return "Catch up";
    } else if (rrt > (rt / 5) * 4) {
      return "Not bad";
    } else if (rrt > (rt / 5) * 3) {
      return "Good";
    } else if (rrt > (rt / 5) * 2) {
      return "Nice";
    }
    else if (rrt > rt / 5) {
      return "Well Done";
    }
    return "Well Done";
  }
  getRespondTimeStatusColor(rt, rrt) {
    if (rrt > (rt / 5) * 5) {
      return brandDanger;
    } else if (rrt > (rt / 5) * 4) {
      return brandWarning;
    } else if (rrt > (rt / 5) * 3) {
      return brandPrimary;
    } else if (rrt > (rt / 5) * 2) {
      return brandInfo;
    } else if (rrt > rt / 5) {
      return brandSuccess;
    }
    return brandSuccess;
  }
  connectChatBot(userinput) {
    return "serversearch";
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
    // all available props
    const theme = {
      background: '#f5f8fb',
      fontFamily: 'Helvetica Neue',
      headerBgColor: '#EF6C00',
      headerFontColor: '#fff',
      headerFontSize: '15px',
      botBubbleColor: '#EF6C00',
      botFontColor: '#fff',
      userBubbleColor: '#fff',
      userFontColor: '#4a4a4a',
    };

    var user = JSON.parse(localStorage.getItem('user'));
    console.log("User in Bot:" + JSON.stringify(user));
    console.log("Avatar in Bot:" + JSON.stringify(user.avatar))
    return (
      <ChatBot
        ref={(el) => this.chatbot = el}
        steps={this.state.steps}
        floating={true}
        botAvatar="assets/img/avatars/robot.jpg"
        userAvatar={user.avatar}
        floatImg="assets/img/TIRA.png"
        theme={theme}
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
    )
  }
}

export default HABot;
