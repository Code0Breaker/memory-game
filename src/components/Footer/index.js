import React, { useEffect, useState } from "react";
// import compare from "../../assets/img/compare.svg";

function MemoryGameFooterList() {
  const [playVariant,setPlayVariant] = useState(0)
  const [chooseVoc, setChooseVoc] = useState('en')
  const [activeSpeed, setActiveSpeed] = useState("standard");
  const [changeSpeed, setChangeSpeed] = useState("Standard");
  let changeSpeedHandler = (state) => {
    changeSpeed(state);
  };
  return (
    <div className="footer">
      <input value={changeSpeed} hidden id="difficulty"/>
      <li className='footerList'>
        <div className='footerListTitle'>Game mode:</div>
        <div className='footerListCards'>
          <div className='card' onClick={() => setPlayVariant(0)}>
            Solo
          </div>
          <div className='card' onClick={() => setPlayVariant(1)}>
            With a friend
          </div>
          <div className='card'>Against computer</div>
        </div>
      </li>
      <li className='footerList'>
        <div className='footerListTitle'>Speed:</div>
        <div className='footerListCards'>
          <div
            className={changeSpeed === "Fast" ? 'choosen' : 'card'}
            onClick={() => setChangeSpeed("Fast")}
          >
            Fast
          </div>
          <div
            className={
              changeSpeed === "Standard" ? 'choosen' :'card'
            }
            onClick={() => setChangeSpeed("Standard")}
          >
            Standard
          </div>
          <div
            className={changeSpeed === "Slow" ? 'choosen' : 'card'}
            onClick={() => setChangeSpeed("Slow")}
          >
            Slow
          </div>
        </div>
      </li>
      <li className='footerList'>
        <div className='footerListTitle'>Vocabulary list:</div>
        <div className='footerListCards'>
          {/* <div className={styles.card}>Vocabulary List 1</div> */}
          <div className='selected'>New vocabulary list</div>
        </div>
      </li>
      <li className='footerList'>
        <div className='footerListTitle'>Language:</div>
        <div className='footerListCards'>
          <select
            name=""
            id="tr1"
            className='selected'
            defaultValue={chooseVoc}
            onChange={(e) => setChooseVoc(e.target.value)}
          >
            <option value="eng" defaultValue>
              English
            </option>
            <option value="ger">German</option>
          </select>
          <div>
            {/* <img src={compare} alt="compare" /> */}
          </div>
          <select
            name=""
            id="tr2"
            className='card'
            defaultValue={chooseVoc}
            onChange={(e) => setChooseVoc(e.target.value)}
          >
            <option value="ger">German</option>
            <option value="eng">English</option>
          </select>
        </div>
      </li>
    </div>
  );
}

export default MemoryGameFooterList;
