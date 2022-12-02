import React from 'react';

export default class AboutMe extends React.Component {
  render() {
    return (
      <div className="container mt-3">
        <div className="row">
          <h1>About Me</h1>
        </div>
        <div className="row">
          <h3>Backstory</h3>
          {/* insert header line here */}
          <h6>
            Hi! I&apos;m Daisy, and I love food. I love food so much I wanted to make a career out of it and went to The Culinary Institue of America for cooking, not baking. I don’t have a sweet tooth like most. But when I decide to indulge in something sweet, my favorite is a chocolate chip cookie.
          </h6>
        </div>
        <div className="row">
          <img />
        </div>
        <div className="row">
          <h6>
            As you can assume, I am very picky about my cookie. I never found one I loved, not too sweet, crunchy edges, chewy center, LOTS of good quality chocolate and all those beautiful cracks that add beauty and texture. So during covid, I decided to make my own version. After perfecting what I think is the perfect chocolate chip cookie, I made different flavors and variations. I hope my cookie research gives you a moment of delight.
          </h6>
        </div>
        <div className="background-color-box"/>
      </div>
    );
  }
}
