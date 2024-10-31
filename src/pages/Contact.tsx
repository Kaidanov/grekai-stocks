import React from 'react';

const Contact = () => {
  return (
    <div className="contact">
      <h1>Contact Us</h1>
      <p>Get in touch with us using the information below.</p>
      <form>
        <input type="text" placeholder="Name" />
        <input type="email" placeholder="Email" />
        <textarea placeholder="Message"></textarea>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Contact; 