import React from 'react';
import moment from 'moment';

const gettext = window.gettext;

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showNotice: false,
      notices: []
    }
  }

  onClick = () => {
    this.setState({
      showNotice: !this.state.showNotice
    })

    if (!this.state.showNotice) {
      this.loadNotices()
    }

    if (this.state.showNotice) {
      this.props.seafileAPI.updateNotifications()
    }
  }

  loadNotices = () => {
    this.props.seafileAPI.listPopupNotices().then(res => {
      this.setState({
        notices: res.data.notices
      })
    })
  }

  render() {
    const { notices } = this.state;

    return (
      <div id="notifications">
        <a href="#" onClick={this.onClick} className="no-deco" id="notice-icon" title="Notifications" aria-label="Notifications">
          <span className="sf2-icon-bell"></span>
          <span className="num hide">0</span>
        </a>
        <div id="notice-popover" className={`sf-popover ${this.state.showNotice ? '': 'hide'}`}>
          <div className="outer-caret up-outer-caret"><div className="inner-caret"></div></div>
          <div className="sf-popover-hd ovhd">
            <h3 className="sf-popover-title">{gettext('Notifications')}</h3>
            <a href="#" onClick={this.onClick} title={gettext('Close')} aria-label={gettext('Close')} className="sf-popover-close js-close sf2-icon-x1 op-icon float-right"></a>
          </div>
          <div className="sf-popover-con">

            <PopupNotices notices={notices} />

            <a href="/notification/list/" className="view-all">{gettext('See All Notifications')}</a>
          </div>
        </div>
      </div>
    )
  }
}

class PopupNotices extends React.Component {

  render() {
    const notices = this.props.notices.map((item, index) =>
      <li key={index} className={item.seen ? "read": "unread"}>
        { item.msg_type === 'repo_share' && <RepoShare item={item} /> }
        { item.msg_type === 'file_uploaded' && <FileUpload item={item} /> }
        { item.msg_type === 'repo_share_to_group' && <RepoShareToGroup item={item} /> }
        { item.msg_type === 'group_msg' && <GroupMsg item={item} /> }
        { item.msg_type === 'group_join_request' && <GroupJoinRequest item={item} /> }
        { item.msg_type === 'add_user_to_group' && <AddUserToGroup item={item} /> }
        { item.msg_type === 'file_comment' && <FileComment item={item} /> }
        { item.msg_type === 'guest_invitation_accepted' && <GuestInvitationAccepted item={item} /> }
      </li>
    )

    return (
      <ul className="notice-list">
      {notices}
      </ul>
    )
  }
}

function FileUpload(props) {
  if (props.item.repo_exist) {
    return (
      <div>
        <img src={props.item.avatar_url} width="32" height="32" className="avatar" />
        <p className="brief">A file named <a href={props.item.file_link}>{props.item.file_name}</a> is uploaded to <a href={props.item.repo_link}>{props.item.repo_name}</a> </p>
        <p className="time">{moment(props.item.time).fromNow()}</p>
        <p>{props.item.repo_exist}</p>
      </div>
    )
  } else {
    return (
      <div>
        <img src={props.item.avatar_url} width="32" height="32" className="avatar" />
        <p className="brief">A file named <strong>{props.item.file_name}</strong> is uploaded to <strong>Deleted Library</strong> </p>
        <p className="time">{moment(props.item.time).fromNow()}</p>
      </div>
    )
  }
}

function RepoShareToGroup(props) {
  if (props.item.path === '/') {
     return (
        <div>
          <a href={props.item.profile_url}>
            <img src={props.item.avatar_url} width="32" height="32" className="avatar" />
          </a>
          <p className="brief">
            {props.item.user} has shared a library named <a href={props.item.lib_url}> {props.item.lib_name} </a> to group <a     href={props.item.group_url}> {props.item.group_name} </a>
          </p>
          <p className="time">{moment(props.item.time).fromNow()}</p>
        </div>
    )
  } else {
    return (
      <div>
        <a href={props.item.profile_url}>
          <img src={props.item.avatar_url} width="32" height="32" className="avatar" />
        </a>
        <p className="brief">
          {props.item.user} has shared a folder named <a href={props.item.lib_url}> {props.item.lib_name} </a> to group <a     href={props.item.group_url}> {props.item.group_name} </a>
        </p>
        <p className="time">{moment(props.item.time).fromNow()}</p>
      </div>
    )
  }
}

function RepoShare(props) {
  if (props.item.path === '/') {
    return (
      <div>
        <a href={'/profile/' + props.item.msg_from}>
          <img src={props.item.avatar_url} width="32" height="32" className="avatar" />
        </a>
        <p className="brief">
          {props.item.user} has shared a library named
          <a href={props.item.lib_url}> {props.item.lib_name} </a> to you.
        </p>
        <p className="time">{moment(props.item.time).fromNow()}</p>
      </div>
    )
  } else {
    return (
      <div>
        <a href={'/profile/' + props.item.msg_from}>
          <img src={props.item.avatar_url} width="32" height="32" className="avatar" />
        </a>
        <p className="brief">
          {props.item.user} has shared a folder named
          <a href={props.item.lib_url}> {props.item.lib_name} </a> to you.
        </p>
        <p className="time">{moment(props.item.time).fromNow()}</p>
      </div>
    )
  }
}


function GroupMsg(props) {
  if (props.item.user) {
    return (
      <div>
        <a href={props.item.profile_url}>
          <img src={props.item.avatar_url} width="32" height="32" className="avatar" />
        </a>
        <p className="brief">{props.item.user} posted a new discussion in <a href={props.item.href}>{props.item.group_name}</a>.</p>
        <p className="clear cspt detail">{props.item.message}</p>
        <p className="time">{moment(props.item.time).fromNow()}</p>
      </div>
    )
  } else {
    return (
      <div>
        <a href={props.item.profile_url}>
          <img src={props.item.avatar_url} width="32" height="32" className="avatar" />
        </a>
        <p className="brief"><a href={props.item.href}>{props.item.group_name}</a> has a new discussion.</p>
        <p className="clear cspt detail">{props.item.message}</p>
        <p className="time">{moment(props.item.time).fromNow()}</p>
      </div>
    )
  }
}

function GroupJoinRequest(props) {
  return (
    <div>
      <a href={props.item.profile_url}>
        <img src={props.item.avatar_url} width="32" height="32" className="avatar" />
      </a>
      <p className="brief">User <a href={props.item.user_profile}>{props.item.username}</a> has asked to join group <a href={props.item.href}>{props.item.group_name}</a>, verification message: {props.item.join_request_msg} </p>
      <p className="time">{moment(props.item.time).fromNow()}</p>
    </div>
  )
}

function AddUserToGroup(props) {
  return (
    <div>
      <a href={props.item.profile_url}>
        <img src={props.item.avatar_url} width="32" height="32" className="avatar" />
      </a>
      <p className="brief">User <a href={props.item.user_profile}>{props.item.group_staff}</a> has added you to group <a href={props.item.href}>{props.item.group_name}</a></p>
      <p className="time">{moment(props.item.time).fromNow()}</p>
    </div>
  )
}

function FileComment(props) {
  return (
    <div>
     <a href={props.item.profile_url}>
       <img src={props.item.avatar_url} width="32" height="32" className="avatar" />
     </a>
     <p className="brief">File <a href={props.item.file_url}>{props.item.file_name}</a> has a new comment from user {props.item.author}</p>
     <p className="time">{moment(props.item.time).fromNow()}</p>
    </div>
  )
}

function GuestInvitationAccepted(props) {
  return (
    <div>
     <a href={props.item.profile_url}>
       <img src={props.item.avatar_url} width="32" height="32" className="avatar" />
     </a>
     <p className="brief">Guest {props.item.user} accepted your <a href={props.item.inv_url}>invitation</a> at {props.item.time}.</p>
     <p className="time">{moment(props.item.time).fromNow()}</p>
    </div>
  )
}

export default Notification;
