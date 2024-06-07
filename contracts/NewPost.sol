// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BShiksha {
    mapping(address => User) public users;
    mapping(address => uint256[]) public walletIdToPostId;

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

    function uploadPost(
        string memory _postTitle,
        string memory _postHash,
        string memory _postDescription,
        uint256 _viewCost
    ) public payable {
        require(bytes(_postHash).length > 0, "Post hash is required");
        require(
            bytes(_postDescription).length > 0,
            "Post description is required"
        );
        require(_viewCost >= 0 && _viewCost <= 50 * 1e18, "Set Value 0-50 ETH");
        // require(msg.value > 0, "Post creation requires a payment");

        // Increment PostCount only after all validations
        PostCount++;
        uint256 postId = PostCount;

        Posts[postId] = Post(
            postId,
            _postTitle,
            _postHash,
            _postDescription,
            0,
            _viewCost,
            payable(msg.sender)
        );

        walletIdToPostId[msg.sender].push(postId);

        emit PostCreated(
            postId,
            _postTitle,
            _postHash,
            _postDescription,
            0,
            _viewCost,
            payable(msg.sender)
        );
    }

    function tipPostOwner(uint256 _id) public payable {
        require(_id > 0 && _id <= PostCount, "Invalid post ID");
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

    function getPost(uint256 postId)
        public
        view
        returns (
            uint256 id,
            string memory title,
            string memory hash,
            string memory description,
            uint256 tipAmount,
            uint256 viewCost,
            address payable author
        )
    {
        Post memory post = Posts[postId];
        return (
            post.id,
            post.title,
            post.hash,
            post.description,
            post.tipAmount,
            post.viewCost,
            post.author
        );
    }

    function viewPost(uint256 _postId) public payable {
        require(_postId > 0 && _postId <= PostCount, "Invalid post ID");
        Post memory post = Posts[_postId];
        if (msg.sender == post.author) {
            return;
        }
        require(
            msg.value >= post.viewCost,
            "Insufficient payment to view the post"
        );
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

    function getUser(address _walletId)
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

    function fetchListOfPostIdsMadeByUser(address _walletId) public view returns ( uint256[] memory ) {
        require(walletIdToPostId[_walletId].length > 0, "Wallet Id does not exist");
        return walletIdToPostId[_walletId];
    }
}