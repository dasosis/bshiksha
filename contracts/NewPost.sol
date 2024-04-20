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
        address payable author;
    }

    // Array to store all posts
    Post[] public posts;

    // Modifier to restrict functions to Faculties only
    modifier onlyFaculty() {
        require(
            userRoles[msg.sender] == Role.Faculty,
            "Only Faculties can create posts"
        );
        _;
    }

    // creating an event for Post uploading
    event PostCreated(
        uint256 id,
        string hash,
        string descripton,
        uint256 tipAmount,
        address payable author
    );

    // creating an event for Post tipping
    event PostTipped(
        uint256 id,
        string hash,
        string descripton,
        uint256 tipAmount,
        address payable author
    );

    // create Posts
    function uploadPost(
        string memory _PostHash,
        string memory _description
    ) public {
        // Makes sure Post hash exists
        require(bytes(_PostHash).length > 0);

        // Makes sure Post description exists
        require(bytes(_description).length > 0);

        // Makes sure uploader address exists
        require(msg.sender != address(0x0));

        // Increment Post count
        PostCount++;

        // Add Post to contract
        Posts[PostCount] = Post(
            PostCount,
            _PostHash,
            _description,
            0,
            payable(msg.sender)
        );

        // Trigger the event
        emit PostCreated(
            PostCount,
            _PostHash,
            _description,
            0,
            payable(msg.sender)
        );
    }

    // Tip Posts
    function tipPostOwner(uint256 _id) public payable {
        // Validating the Post
        require(_id > 0 && _id <= PostCount);
        // Fetching the Post/post
        // Post memory _Post = Posts[_id];

        // Fetching address of author of Post/post
        // address payable _author = _Post.author;
        address payable _author = Posts[_id].author;

        // Paying the author
        _author.transfer(msg.value);

        // Increment the tip amount
        // _Post.tipAmount = _Post.tipAmount + msg.value;
        Posts[_id].tipAmount += msg.value;

        // Update the Post in mapping
        // Posts[_id] = _Post;

        // Trigger event when an Post is tipped
        emit PostTipped(
            _id,
            Posts[_id].hash,
            Posts[_id].description,
            Posts[_id].tipAmount,
            _author
        );
    }
}