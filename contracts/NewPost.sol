// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BShiksha {
    mapping(address => User) public users;

    struct User {
        string userName;
        string userEmail;
        bool isProfessor;
        string universityName;
        address payable walletId;
    }

    uint256 public PostCount = 0;
    mapping(uint256 => Post) public Posts;

    struct Post {
        uint256 id;
        string title;
        string hash;
        string description;
        uint256 tipAmount;
        uint256 viewCost;
        address payable author;
    }

    Post[] public posts;

    event UserSignedUp(
        string userName,
        string userEmail,
        bool isProfessor,
        string universityName,
        address payable walletId
    );

    event PostCreated(
        uint256 id,
        string title,
        string hash,
        string description,
        uint256 tipAmount,
        uint256 viewCost,
        address payable author
    );

    event PostTipped(
        uint256 id,
        string title,
        string hash,
        string description,
        uint256 tipAmount,
        uint256 viewCost,
        address payable author
    );

    event PostViewed(
        uint256 id,
        string title,
        string hash,
        string description,
        uint256 tipAmount,
        uint256 viewCost,
        address payable author
    );

    function uploadPost (
        uint256 _postId,
        string memory _postTitle,
        string memory _postHash,
        string memory _postDescription,
        uint256 _viewCost
    ) public returns (uint256) {
        require(bytes(_postHash).length > 0);
        require(bytes(_postDescription).length > 0);
        require(_viewCost  >= 0 && _viewCost  <= 50 * 1e18, "Set Value 0-50 ETH");

        PostCount++;

        Posts[_postId] = Post(
            _postId,
            _postTitle,
            _postHash,
            _postDescription,
            0,
            _viewCost,
            payable(msg.sender)
        );

        emit PostCreated(
            _postId,
            _postTitle,
            _postHash,
            _postDescription,
            0,
            _viewCost,
            payable(msg.sender)
        );

        return PostCount;
    }

    function tipPostOwner(uint256 _id) public payable {
        require(_id >= 0 && _id <= PostCount);
        address payable _author = Posts[_id].author;
        _author.transfer(msg.value);
        Posts[_id].tipAmount += msg.value;
        emit PostTipped(
            _id,
            Posts[_id].title,
            Posts[_id].hash,
            Posts[_id].description,
            Posts[_id].tipAmount,
            Posts[_id].viewCost,
            _author
        );
    }

    function getPost(uint256 postId) public view returns (uint256 id, string memory title, string memory hash, string memory description, uint256 tipAmount, uint256 viewCost, address payable author) {
        Post memory post = Posts[postId];
        return (post.id, post.title, post.hash, post.description, post.tipAmount, post.viewCost, post.author);
    }

    function viewPost(uint256 _postId) public payable {
        require(_postId >= 0 && _postId <= PostCount);
        Post memory post = Posts[_postId];
        if(msg.sender == post.author) {
            return;
        }
        require(msg.value >= post.viewCost, "Insufficient payment to view the post");
        sendViaCall(payable(address(post.author)), msg.value);
        emit PostViewed(
            _postId,
            post.title,
            post.hash,
            post.description,
            post.tipAmount,
            msg.value, 
            post.author
        );
    }

    function sendViaCall(address payable _to, uint256 _amount) internal {
        (bool sent, ) = _to.call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }

    function getUser(
        address _walletId
    )
        public
        view
        returns (
            string memory userName,
            string memory userEmail,
            bool isProfessor,
            string memory universityName,
            address payable walletId
        )
    {
        require(
            users[_walletId].walletId != address(0),
            "User does not exist!!"
        );
        User memory user = users[_walletId];
        return (
            user.userName,
            user.userEmail,
            user.isProfessor,
            user.universityName,
            user.walletId
        );
    }

    function signUpUser(
        string memory _userName,
        string memory _userEmail,
        bool _isProfessor,
        string memory _universityName
    ) public {
        require(
            users[msg.sender].walletId == address(0),
            "User already exists"
        );

        users[msg.sender] = User({
            userName: _userName,
            userEmail: _userEmail,
            isProfessor: _isProfessor,
            universityName: _universityName,
            walletId: payable(msg.sender)
        });

        emit UserSignedUp(
        _userName,
        _userEmail,
        _isProfessor,
        _universityName,
        payable(msg.sender)
    );
    }
}