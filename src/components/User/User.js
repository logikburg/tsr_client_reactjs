import React from 'react';

const User = {}

User.info = localStorage.getItem('user');
User.avatar = (function () {
	var user = JSON.parse(User.info);
	//console.log(user.avatar);
	if (user && user.avatar) {
		console.log('Avatar', user.avatar);

		return (
			<img src={user.avatar} className="img-avatar" alt={user.email} />
		)
	}
	return (
		<img src={'assets/img/avatars/0.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />
	)
})()
export default User;
