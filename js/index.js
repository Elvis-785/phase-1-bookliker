// document.addEventListener("DOMContentLoaded", function() {});
document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3000/books")
      .then(response => response.json())
      .then(books => {
        const list = document.getElementById("list");
        books.forEach(book => {
          const li = document.createElement("li");
          li.textContent = book.title;
          li.dataset.id = book.id;
          list.appendChild(li);
  
          // Add event listener to show details
          li.addEventListener("click", () => showDetails(book.id));
        });
      });
  });
  
  function showDetails(bookId) {
    fetch(`http://localhost:3000/books/${bookId}`)
      .then(response => response.json())
      .then(book => {
        const showPanel = document.getElementById("show-panel");
        showPanel.innerHTML = `
          <img src="${book.img_url}" alt="${book.title}"/>
          <h2>${book.title}</h2>
          <p>${book.description}</p>
          <h3>Liked by:</h3>
          <ul id="user-list">
            ${book.users.map(user => `<li>${user.username}</li>`).join('')}
          </ul>
          <button id="like-button">Like</button>
        `;
  
        // Add event listener to like button
        document.getElementById("like-button").addEventListener("click", () => likeBook(book));
      });
  }
  
  function likeBook(book) {
    const currentUser = { id: 1, username: "Kirui" };
  
    // Check if the user has already liked the book
    if (book.users.some(user => user.id === currentUser.id)) {
      // Unlike the book
      book.users = book.users.filter(user => user.id !== currentUser.id);
    } else {
      // Like the book
      book.users.push(currentUser);
    }
  
    fetch(`http://localhost:3000/books/${book.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ users: book.users })
    })
      .then(response => response.json())
      .then(updatedBook => {
        // Update the DOM
        const userList = document.getElementById("user-list");
        userList.innerHTML = updatedBook.users.map(user => `<li>${user.username}</li>`).join('');
      });
  }
  