//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BShiksha {
    receive() external payable {}
    fallback() external payable {}

    uint256 public PostCount = 0;
    mapping(uint256 => Post) public Posts;

    struct Post {
        uint256 id;
        string hash;
        string description;
        uint256 viewCost;
        address payable author;
    }

    Post[] public posts;

    event PostCreated(
        uint256 id,
        string hash,
        string description,
        uint256 viewCost,
        address payable author
    );
    event TransactionCompleted(
        address payable indexed author,
        uint256 amount
    );

    function uploadPost (
        string memory _PostHash,
        string memory _description,
        uint256 _viewCost
    ) public returns (uint256) {
        require(bytes(_PostHash).length > 0);
        require(bytes(_description).length > 0);
        require(_viewCost >= 0 && _viewCost <= 1000000000000000000);
        PostCount++;
        Posts[PostCount] = Post(
            PostCount,
            _PostHash,
            _description,
            _viewCost,
            payable(msg.sender)
        );

        emit PostCreated(
            PostCount,
            _PostHash,
            _description,
            _viewCost,
            payable(msg.sender)
        );

        return PostCount;
    }

    function callPost(uint256 postId) public view returns (
        uint256 id,
        string memory hash,
        string memory description,
        uint256 viewCost,
        address payable author
        ) {
            Post memory post = Posts[postId];
            return (
                post.id,
                post.hash,
                post.description,
                post.viewCost, 
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
}