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
        string postCid;
        uint256 tipAmount;
        uint256 viewCost;
        address payable author;
    }

    event UserSignedUp(
        string userName,
        string indexed userEmail,
        bool isProfessor,
        string universityName,
        address payable walletId
    );


    event PostCreated(
        uint256 id,
        string postCid,
        uint256 tipAmount,
        uint256 viewCost,
        address payable author
    );

    event PostTipped(
        uint256 id,
        string postCid,
        uint256 tipAmount,
        uint256 viewCost,
        address payable author
    );

    event PostViewed(
        uint256 id,
        string postCid,
        uint256 tipAmount,
        uint256 viewCost,
        address payable author
    );

    event CommentAdded(
        uint256 indexed postId,
        string commentCid,
        address commenter
    );

    function uploadPost(
        string memory _postCid,
        uint256 _viewCost
    ) public payable {
        require(bytes(_postCid).length > 0, "Post hash is required");
        require(_viewCost >= 0 && _viewCost <= 50 * 1e18, "Set Value 0-50 ETH");

        PostCount++;
        uint256 postId = PostCount;

        Posts[postId] = Post(
            postId,
            _postCid,
            0,
            _viewCost,
            payable(msg.sender)
        );

        walletIdToPostId[msg.sender].push(postId);

        emit PostCreated(postId, _postCid, 0, _viewCost, payable(msg.sender));
    }

    // function tipPostOwner(uint256 _id) public payable {
    //     require(_id > 0 && _id <= PostCount, "Invalid post ID");
    //     address payable _author = Posts[_id].author;
    //     _author.transfer(msg.value);
    //     Posts[_id].tipAmount += msg.value;
    //     emit PostTipped(
    //         _id,
    //         Posts[_id].postCid,
    //         Posts[_id].tipAmount,
    //         Posts[_id].viewCost,
    //         _author
    //     );
    // }

    function getPost(
        uint256 postId
    )
        public
        view
        returns (
            uint256 id,
            string memory postCid,
            uint256 tipAmount,
            uint256 viewCost,
            address payable author
        )
    {
        Post memory post = Posts[postId];
        return (
            post.id,
            post.postCid,
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
            post.postCid,
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

    function fetchListOfPostIdsMadeByUser(
        address _walletId
    ) public view returns (uint256[] memory) {
        require(
            walletIdToPostId[_walletId].length > 0,
            "Wallet Id does not exist"
        );
        return walletIdToPostId[_walletId];
    }

    function uploadPostComment(
        uint256 _postId,
        string memory _commentCid
    ) public {
        require(_postId > 0 && _postId <= PostCount, "Invalid post ID");
        emit CommentAdded(_postId, _commentCid, msg.sender);
    }
}