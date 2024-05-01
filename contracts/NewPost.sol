// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BShiksha {
    enum Role {
        Faculty,
        Viewer
    }
    mapping(address => Role) public userRoles;

    function assignUserRoles(string memory _userType) public pure returns (Role) {
        bytes32 userType = keccak256(abi.encodePacked(_userType));
        if (userType == keccak256(abi.encodePacked("faculty"))) {
            return Role.Faculty;
        } else {
            return Role.Viewer;
        }
    }

    uint256 public PostCount = 0;
    mapping(uint256 => Post) public Posts;

    struct Post {
        uint256 id;
        string hash;
        string description;
        uint256 tipAmount;
        uint256 viewCost;
        address payable author;
    }

    Post[] public posts;

    modifier onlyFacultyMember() {
        require(
            userRoles[msg.sender] == Role.Faculty,
            "Only faculty members can create posts"
        );
        _;
    }

    event PostCreated(
        uint256 id,
        string hash,
        string description,
        uint256 tipAmount,
        uint256 viewCost,
        address payable author
    );

    event PostTipped(
        uint256 id,
        string hash,
        string description,
        uint256 tipAmount,
        uint256 viewCost,
<<<<<<< HEAD
        address payable author
    );

    event PostViewed(
        uint256 id,
        string hash,
        string description,
        uint256 tipAmount,
        uint256 viewCost,
        address payable author
    );

    // create Posts
=======
        address payable author
    );

    event PostViewed(
        uint256 id,
        string hash,
        string description,
        uint256 tipAmount,
        uint256 viewCost,
        address payable author
    );

>>>>>>> origin/soumya
    function uploadPost (
        uint256 _postId,
        string memory _PostHash,
        string memory _description,
        uint256 _viewCost
    ) public onlyFacultyMember returns (uint256) {
<<<<<<< HEAD
        // Makes sure Post hash exists
=======
>>>>>>> origin/soumya
        require(bytes(_PostHash).length > 0);
        require(bytes(_description).length > 0);
        require(_viewCost  >= 0 && _viewCost  <= 50 * 1e18, "Set Value 0-50 ETH");

<<<<<<< HEAD
        // uint256 value = 18 - _exp;
        // _viewCost = (_viewCost * 1e18) / value;

        // Make sure minViewCost is valid
        // require(_minViewCost >=10000000 gwei && _minViewCost <= 1000000000 gwei, "Payment amount must be between 0000000 GWEI and 1000000000 GWEI");
        require(_viewCost  >= 0 && _viewCost  <= 50 * 1e18 , "Maximum viewing cost must be between 0.03 ETH and 0.07 ETH");

        // Increment Post count
        PostCount++;

        // Add Post to contract
=======
        PostCount++;

>>>>>>> origin/soumya
        Posts[_postId] = Post(
            _postId,
            _PostHash,
            _description,
            0,
            _viewCost,
            payable(msg.sender)
        );

<<<<<<< HEAD

        // Trigger the event
=======
>>>>>>> origin/soumya
        emit PostCreated(
            _postId,
            _PostHash,
            _description,
            0,
            _viewCost,
            payable(msg.sender)
        );

        return PostCount;
    }

    function tipPostOwner(uint256 _id) public payable {
<<<<<<< HEAD
        // Validating the Post
        require(_id >= 0 && _id <= PostCount);

        // Fetching the author of Post/post
=======
        require(_id >= 0 && _id <= PostCount);
>>>>>>> origin/soumya
        address payable _author = Posts[_id].author;
        _author.transfer(msg.value);
        Posts[_id].tipAmount += msg.value;
        emit PostTipped(
            _id,
            Posts[_id].hash,
            Posts[_id].description,
            Posts[_id].tipAmount,
            Posts[_id].viewCost,
            _author
        );
    }

    function getPost(uint256 postId) public view returns (uint256 id, string memory hash, string memory description, uint256 tipAmount, uint256 viewCost, address payable author) {
        Post memory post = Posts[postId];
        return (post.id, post.hash, post.description, post.tipAmount, post.viewCost, post.author);
    }

    function viewPost(uint256 _postId) public payable {
<<<<<<< HEAD
        // Validating the Post
        require(_postId >= 0 && _postId <= PostCount);

        // Fetching the post
        Post memory post = Posts[_postId];

        // Ensuring payment is enough to view the post
        require(msg.value >= post.viewCost, "Insufficient payment to view the post");

        // Paying the author
        // post.author.transfer(msg.value);
        sendViaCall(payable(address(post.author)), msg.value);

        // Emit event for post view
=======
        require(_postId >= 0 && _postId <= PostCount);
        Post memory post = Posts[_postId];
        require(msg.value >= post.viewCost, "Insufficient payment to view the post");
        sendViaCall(payable(address(post.author)), msg.value);
>>>>>>> origin/soumya
        emit PostViewed(
            _postId,
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
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/soumya
