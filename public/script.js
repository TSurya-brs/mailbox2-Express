let mailbox = []; 
let archivedMailbox = [];
let currentView = 'inbox'; // Can be 'inbox' or 'archived'

// Fetch mailbox data from the server
const fetchMailbox = async () => {
  try {
    const response = await fetch('/api/mailbox');
    if (response.ok) {
      const data = await response.json();
      console.log('Mailbox Data:', data);  // Log fetched data
      mailbox = data;
      displayMailbox(mailbox);  // Show the inbox data
    } else {
      console.error('Failed to fetch mailbox data:', response.status);
    }
  } catch (error) {
    console.error('Error fetching mailbox data:', error);
  }
};

// Function to display mailbox data in the table
const displayMailbox = (mailbox) => {
  const mailboxTable = document.querySelector('#mailboxTable tbody');
  mailboxTable.innerHTML = ''; // Clear any existing rows

  mailbox.forEach(email => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="checkbox" data-id="${email.id}" class="emailCheckbox"></td>
      <td>${email.sender}</td>
      <td>${email.subject}</td>
      <td>${email.date}</td>
    `;
    if (email.read) {
      row.classList.add('read');
    } else {
      row.classList.add('unread');
    }

    // Clicking the row should open the email, but not when clicking on the checkbox
    row.addEventListener('click', (event) => {
      if (event.target.type !== 'checkbox') {
        openEmail(email);  // Open email only if the checkbox is not clicked
      }
    });
    mailboxTable.appendChild(row);
  });
};

// Open email when clicked (displays it below the table)
const openEmail = (email) => {
  const emailDetails = document.querySelector('#emailDetails');
  
  // Ensure we are opening the email in the correct view
  let emailToDisplay = null;

  // Check if the current view is 'archived' or 'inbox'
  if (currentView === 'archived') {
    emailToDisplay = archivedMailbox.find(e => e.id === email.id);
  } else if (currentView === 'inbox') {
    emailToDisplay = mailbox.find(e => e.id === email.id);
  }

  // If the email exists, display it
  if (emailToDisplay) {
    emailDetails.innerHTML = `
      <h4>From: ${emailToDisplay.sender}</h4>
      <p><strong>Subject:</strong> ${emailToDisplay.subject}</p>
      <p><strong>Date:</strong> ${emailToDisplay.date}</p>
      <p><strong>Content:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sit amet.</p>
    `;

    // Mark the email as read
    emailToDisplay.read = true;

    // Re-render the mailbox view (inbox or archived) to reflect the change
    displayMailbox(currentView === 'inbox' ? mailbox : archivedMailbox);

    // Show email content section below the table
    document.querySelector('#emailContent').style.display = 'block';
  }
};

// Mark selected emails as read
const markAsRead = () => {
  const selectedEmails = getSelectedEmails();
  selectedEmails.forEach(email => email.read = true);
  displayMailbox(currentView === 'inbox' ? mailbox : archivedMailbox);
};

// Mark selected emails as unread
const markAsUnread = () => {
  const selectedEmails = getSelectedEmails();
  selectedEmails.forEach(email => email.read = false);
  displayMailbox(currentView === 'inbox' ? mailbox : archivedMailbox);
};

// Move selected emails to archive
const moveToArchive = () => {
  const selectedEmails = getSelectedEmails();
  selectedEmails.forEach(email => {
    email.archived = true;
    mailbox = mailbox.filter(e => e.id !== email.id); // Remove from inbox
  });
  archivedMailbox = [...archivedMailbox, ...selectedEmails];  // Add to archive
  displayMailbox(mailbox);
};

// Move selected emails from archive to inbox
const moveToInbox = () => {
  const selectedEmails = getSelectedEmails();
  selectedEmails.forEach(email => {
    email.archived = false;
    archivedMailbox = archivedMailbox.filter(e => e.id !== email.id); // Remove from archive
  });
  mailbox = [...mailbox, ...selectedEmails];  // Add back to inbox
  displayMailbox(mailbox);
};

// Get selected emails from the table
const getSelectedEmails = () => {
  const checkboxes = document.querySelectorAll('.emailCheckbox:checked');
  const selectedIds = Array.from(checkboxes).map(cb => Number(cb.getAttribute('data-id')));
  if (currentView === 'inbox') {
    return mailbox.filter(email => selectedIds.includes(email.id));
  } else {
    return archivedMailbox.filter(email => selectedIds.includes(email.id));
  }
};

// Event listeners for action buttons
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('markAsReadBtn')?.addEventListener('click', markAsRead);
  document.getElementById('markAsUnreadBtn')?.addEventListener('click', markAsUnread);
  document.getElementById('moveToArchiveBtn')?.addEventListener('click', moveToArchive);
  document.getElementById('moveToInboxBtn')?.addEventListener('click', moveToInbox);  // Add listener for move to inbox
  document.getElementById('inboxBtn')?.addEventListener('click', () => {
    currentView = 'inbox';
    displayMailbox(mailbox);
  });
  document.getElementById('archivedBtn')?.addEventListener('click', () => {
    currentView = 'archived';
    displayMailbox(archivedMailbox);
  });
});

// Load mailbox data when the page loads
document.addEventListener('DOMContentLoaded', fetchMailbox);
