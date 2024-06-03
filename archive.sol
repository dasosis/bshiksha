// From somo
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BShiksha {
    // Enum to represent user roles
    enum Role {
        Faculty,
        Viewer
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    // Mapping to store user addresses and their roles
    mapping(address => Role) public userRoles;

    function assignUserRoles(
        string memory _userType
    ) public pure returns (Role) {
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
        uint256 viewCost;
        uint256 tipAmount;
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
        uint256 viewCost,
        uint256 tipAmount,
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
    function uploadPost(
        string memory _PostHash,
        string memory _description,
        uint256 _viewCost
    ) public onlyFacultyMember returns (uint256) {
        // Makes sure Post hash exists
        require(bytes(_PostHash).length > 0);

        // Makes sure Post description exists
        require(bytes(_description).length > 0);

        // Make sure _viewCost is valid
        // require(_viewCost >= 1000 && _viewCost <= 100000);
        // Increment Post count
        PostCount++;

        // Add Post to contract
        Posts[PostCount] = Post(
            PostCount,
            _PostHash,
            _description,
            _viewCost,
            0,
            payable(msg.sender)
        );

        // Trigger the event
        emit PostCreated(
            PostCount,
            _PostHash,
            _description,
            _viewCost,
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

    function getPost(
        uint256 postId
    )
        public
        view
        returns (
            uint256 id,
            string memory hash,
            string memory description,
            uint256 viewCost,
            uint256 tipAmount,
            address payable author
        )
    {
        Post memory post = Posts[postId];
        return (
            post.id,
            post.hash,
            post.description,
            post.viewCost,
            post.tipAmount,
            post.author
        );
    }

    // mapping(uint256 => mapping(address => bool)) public hasPaid;

    function viewPost(uint256 postId) public payable {
        // require(!hasPaid[postId][msg.sender]);
        // require(msg.value == Posts[postId].viewCost);

        // Process payment
        sendViaCall(payable(address(this)), msg.value);
        // hasPaid[postId][msg.sender] = true;
    }
    function sendViaCall(address payable _to, uint256 _amount) internal {
        // Call returns a boolean value indicating success or failure.
        // This is the current recommended method to use.
        (bool sent, ) = _to.call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }
}


// From shonky
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
        // require(_minViewCost >=10000000 gwei && _minViewCost <= 1000000000 gwei, "Payment amount must be between 0000000 GWEI and 1000000000 GWEI");
        require(_maxViewCost >= 30000000000000 && _maxViewCost <= 70000000000000 , "Maximum viewing cost must be between 0.03 ETH and 0.07 ETH");

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

/*
    mapping(uint256 => mapping(address => bool)) public hasPaid;

    function viewPost(uint256 postId) public payable {
        require(!hasPaid[postId][msg.sender], "Already paid to view post");
        require(msg.value == Posts[postId].minViewCost, "Incorrect payment amount");

        
        payable(address(this)).transfer(msg.value);
        hasPaid[postId][msg.sender] = true;
    }

    function isPaid(uint256 postId, address user) public view returns (bool) {
        return hasPaid[postId][user];
    }
*/

    function viewPost(uint256 _postId) public payable {
        // Validating the Post
        require(_postId > 0 && _postId <= PostCount);

        // Fetching the post
        Post memory post = Posts[_postId];

        // Ensuring payment is enough to view the post
        require(msg.value >= post.maxViewCost, "Insufficient payment to view the post");

        // Paying the author
        // post.author.transfer(msg.value);
        sendViaCall(payable(address(post.author)), msg.value);

        // Emit event for post view
        emit PostTipped(
            _postId,
            post.hash,
            post.description,
            msg.value, // Tip amount is the payment for viewing
            post.author
        );

}

    function transactPost(uint256 postId) public payable returns(
            address payable author
        )
        {
            require(msg.value == Posts[postId].viewCost);
            author = Posts[postId].author;
            emit TransactionCompleted(author, msg.value);
            sendViaCall(payable(address(author)), msg.value);
            return author;
        }
    
    function sendViaCall(address payable _to, uint256 _amount) internal {
        (bool sent, ) = _to.call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }

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
