/*
 * Greeting.jsx
 * Copyright (C) 2024 sakakibara <sakakibara@organon>
 *
 * Distributed under terms of the MIT license.
 */
import { useState } from 'react';


export default function Greeting({messages}) {
  const randomMessage = () => messages[(Math.floor(Math.random() * messages.length))];
  const [greeting, setGreeting] = useState(randomMessage());

  return (
    <div>
      <h3>{greeting}</h3>
    </div>
  );
}
