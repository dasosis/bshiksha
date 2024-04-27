// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BShiksha {
    // Enum to represent user roles
    enum Role {
        Faculty,
        Viewer
    }

    // Mapping to store user addresses and their roles
    mapping(address => Role) public userRoles;

    function assignUserRoles(string memory _userType) public pure returns (Role) {
        // Convert user type to lowercase for case-insensitive comparison
        bytes32 userType = keccak256(abi.encodePacked(_userType));

        // Assign roles based on user type
        if (userType == keccak256(abi.encodePacked("faculty"))) {
            return Role.Faculty;
        } else {
            return Role.Viewer;
        }
    }

    // Stores Posts
    uint256 public PostCount = 0;
    mapping(uint256 => Post) public Posts;

    struct Post {
        uint256 id;
        string hash;
        string description;
        uint256 tipAmount;
        uint256 minViewCost;
        address payable author;
    }

    // Array to store all posts
    Post[] public posts;

    // Modifier to restrict functions to faculty members only
    modifier onlyFacultyMember() {
        require(
            userRoles[msg.sender] == Role.Faculty,
            "Only faculty members can create posts"
        );
        _;
    }

    // creating an event for Post uploading
    event PostCreated(
        uint256 id,
        string hash,
        string description,
        uint256 tipAmount,
        uint256 minViewCost,
        address payable author
    );

    // creating an event for Post tipping
    event PostTipped(
        uint256 id,
        string hash,
        string description,
        uint256 tipAmount,
        address payable author
    );

    // create Posts
    function uploadPost (
        string memory _PostHash,
        string memory _description,
        uint256 _minViewCost
    ) public onlyFacultyMember returns (uint256) {
        // Makes sure Post hash exists
        require(bytes(_PostHash).length > 0);

        // Makes sure Post description exists
        require(bytes(_description).length > 0);

        // Make sure minViewCost is valid
        require(_minViewCost >=10000000 gwei && _minViewCost <= 1000000000 gwei, "Payment amount must be between 0000000 GWEI and 1000000000 GWEI");

        // Increment Post count
        PostCount++;

        // Add Post to contract
        Posts[PostCount] = Post(
            PostCount,
            _PostHash,
            _description,
            _minViewCost,
            0,
            payable(msg.sender)
        );


        // Trigger the event
        emit PostCreated(
            PostCount,
            _PostHash,
            _description,
            _minViewCost,
            0,
            payable(msg.sender)
        );

        return PostCount;
    }

    // Tip Posts
    function tipPostOwner(uint256 _id) public payable {
        // Validating the Post
        require(_id > 0 && _id <= PostCount);

        // Fetching the author of Post/post
        address payable _author = Posts[_id].author;

        // Paying the author
        _author.transfer(msg.value);

        // Increment the tip amount
        Posts[_id].tipAmount += msg.value;

        // Trigger event when a Post is tipped
        emit PostTipped(
            _id,
            Posts[_id].hash,
            Posts[_id].description,
            Posts[_id].tipAmount,
            _author
        );
    }

    function getPost(uint256 postId) public view returns (uint256 id, string memory hash, string memory description, uint256 minViewCost, uint256 tipAmount, address payable author) {
        Post memory post = Posts[postId];
        return (post.id, post.hash, post.description, post.minViewCost, post.tipAmount, post.author);
    }

    mapping(uint256 => mapping(address => bool)) public hasPaid;

    function viewPost(uint256 postId) public payable {
        require(!hasPaid[postId][msg.sender], "Already paid to view post");
        require(msg.value == Posts[postId].minViewCost, "Incorrect payment amount");

        // Process payment
        payable(address(this)).transfer(msg.value);
        hasPaid[postId][msg.sender] = true;
    }

    function isPaid(uint256 postId, address user) public view returns (bool) {
        return hasPaid[postId][user];
    }

}
