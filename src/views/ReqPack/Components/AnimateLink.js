import React, { Component } from 'react';
import _ from 'lodash';
class AnimateLink extends Component {
    constructor(props) {
        super(props);
        this.className = "anim-" + this.props.className;
        this.browseLink = [];
        this.state = {
            data: this.props.data
        };
        this.underline = null;
        this.active = null;

        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.timeoutHandling = this.timeoutHandling.bind(this);
        this.handleUnderlineMouseOver = this.handleUnderlineMouseOver.bind(this);
        this.handleUnderlineMouseLeave = this.handleUnderlineMouseLeave.bind(this);
        window.addEventListener("resize", this.timeoutHandling);
    }
    componentDidMount() {
        this.timeoutHandling();
    }

    addBrowseLink(el) {
        if (el) {
            this.browseLink.push(el);
            this.browseLink = _.uniqWith(this.browseLink, _.isEqual);
        }
    }
    timeoutHandling() {
        if (this.active) {
            this.active.className = this.active.className.replace(" active", "");
            this.active.className = this.active.className + " active";
            this.underline.style.top = (parseInt(this.active.offsetTop) + parseInt(this.active.offsetHeight)) + "px";
            this.underline.style.left = this.active.offsetLeft + "px";
        }
    }
    handleLinkClick(event, link, idx) {
        this.browseLink.forEach((alink) => {
            alink.classList.remove('active');
        })
        event.target.classList.toggle('active');
        this.active = event.target;
        if (typeof this.props.onClick === "function") this.props.onClick(event, link, idx);
        this.state.data.forEach(_link => {
            _link.isActive = false;
        })
        link.isActive = true;
        const data = Object.assign([], this.state.data);
        this.setState({
            data: data
        });
    }
    handleMouseOver(event) {
        if (this.active != null) {
            this.active.className = this.active.className.replace(" active", "");
        }
        this.underline.style.top = (parseInt(event.target.offsetTop) + parseInt(event.target.offsetHeight)) + "px";
        this.underline.style.left = event.target.offsetLeft + "px";
        if (this.timeout) clearTimeout(this.timeout);
    }
    handleMouseLeave(event) {
        if (this.active != null) {
            this.timeout = setTimeout(this.timeoutHandling, 200);
        }
    }
    handleUnderlineMouseOver() {
        if (this.timeout) clearTimeout(this.timeout);
    }
    handleUnderlineMouseLeave() {
        if (this.active != null) {
            this.timeout = setTimeout(this.timeoutHandling, 200);
        }
    }
    render() {
        const linkList = () => {
            var hasActiveLink = false;
            const data = this.state.data;
            for (var i = 0; i < data.length; i++) {
                if (data[i].isActive) {
                    hasActiveLink = true;
                    break;
                }
            }
            if (!hasActiveLink && data.length > 0) data[0].isActive = true;
            return data.map((link, idx) => {
                //const key = "a_" + link.label.replace(" ", "_");
                const key = "a_" + link.title.replace(" ", "_");
                const url = "#/" + link._id + "/new";
                return (
                    <a href={url} key={key}
                        style={{ display: 'block', marginLeft: "12px" }}
                        ref={(el) => {
                            if (link.isActive) { this.active = el };
                            this.addBrowseLink(el);
                        }}
                        className={link.isActive ? "active" : ""}
                        onMouseEnter={(event) => this.handleMouseOver(event)}
                        onMouseLeave={(event) => this.handleMouseLeave(event)}>
                        {link.title}
                    </a>
                )
            })
        }
        return (
            <div className="animate">
                <div className={this.className}>
                    <div className="links-container">
                        {linkList()}
                        <span ref={(el) => this.underline = el} className="underline"
                            onMouseEnter={(event) => this.handleUnderlineMouseOver()}
                            onMouseLeave={(event) => this.handleUnderlineMouseLeave(event)}>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default AnimateLink;