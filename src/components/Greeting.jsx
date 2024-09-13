/*
 * Greeting.jsx
 * Copyright (C) 2024 sakakibara <sakakibara@organon>
 *
 * Distributed under terms of the MIT license.
 */
import { useState, useEffect } from 'react';


export default function Greeting({messages}) {
  const [greeting, setGreeting] = useState();

  useEffect(() => {
    const randomMessage = () => messages[(Math.floor(Math.random() * messages.length))];
    setGreeting(randomMessage());
  }, [messages]);

  return (
    <div>
      <h3>{greeting}</h3>
    </div>
  );
}
