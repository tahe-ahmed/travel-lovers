import React from 'react';

import { SectionsContainer, Section } from 'react-fullpage';

import SectionOne from './SectionOne';
import SectionTwo from './SectionTwo';
import SectionTree from './SectionTree';

import './HomePage.css';

function HomePage() {

  let options = {
    sectionClassName: 'section',
    anchors: ['sectionOne', 'sectionTwo', 'sectionThree'],
    scrollBar: true,
    navigation: false,
    verticalAlign: false,
    sectionPaddingTop: '0px',
    sectionPaddingBottom: '0px',
    arrowNavigation: true
  };

  return (<>
    <SectionsContainer {...options}>
      <Section>
        <SectionOne />
      </Section>
      {/* <Section>
        <SectionTwo />
      </Section> */}
      <Section>
        <SectionTree />
      </Section>
    </SectionsContainer>
  </>
  );
}

export default HomePage;
