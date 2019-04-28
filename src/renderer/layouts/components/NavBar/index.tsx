import { memo, useState, useEffect } from 'react';
import { Menu, Dropdown, Input } from 'antd';
import router from 'umi/router';
import { debounce } from 'lodash';

import { CustomIcon } from '@/components/CustomIcon';
import { SuggestRspData, getSuggest } from '@/services/suggest';
import styles from './index.less';

const Search = Input.Search;

const NavBar = ({ history: { length } }) => {
  const [changeIndx, setChangeIndx] = useState(0);
  const [suggests, setSuggests] = useState(null);
  const [text, setText] = useState('');
  const [visible, setVisible] = useState(false);

  const fetchSuggests = debounce(async (kw) => {
    if (!kw) {
      setSuggests(null);
      return;
    }
    const {
      data: { result },
    }: { data: SuggestRspData } = await getSuggest({ kw });
    let suggests = [...result.albumResultList, ...result.queryResultList];
    if (suggests.length < 1) {
      suggests = null;
    }
    // todo (only support albumResult now)
    setSuggests(suggests);
  }, 200);

  const handleRedirectSearch = (kw) => {
    setText(kw);
    setVisible(false);
    router.push(`/search/${kw}`);
  };

  const handleInputChange = (e) => {
    const kw = e.target.value;
    setText(kw);
    fetchSuggests(kw);
  };

  const handleSearchClick = (kw) => {
    handleRedirectSearch(kw);
  };

  const handleFocus = () => {
    setVisible(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setVisible(false);
    }, 100);
  };

  const handlePressEnter = (e) => {
    const kw = e.target.value;
    handleRedirectSearch(kw);
  };

  const handleArrowClick = (n) => {
    return () => {
      const x = changeIndx + n;
      if (x < 1 && length + x >= 2) {
        setChangeIndx(changeIndx + n);
        router.go(n);
      }
    };
  };

  // todo fix
  // const handleRefreshClick = () => {
  //   location.reload();
  // };

  const Suggests = suggests ? (
    <Menu className={styles.suggests}>
      {suggests.map(({ highlightKeyword, keyword, id }) => {
        return (
          <Menu.Item key={id}>
            <div
              className={styles.suggestItem}
              onClick={() => {
                handleRedirectSearch(keyword);
              }}
            >
              <span dangerouslySetInnerHTML={{ __html: highlightKeyword }} />
            </div>
          </Menu.Item>
        );
      })}
    </Menu>
  ) : null;

  return (
    <div className={styles.nav}>
      <CustomIcon
        className={`${styles.icon} ${
          length + changeIndx <= 2 ? styles.inactivate : ''
        }`}
        onClick={handleArrowClick(-1)}
        type='icon-arrow-left'
      />
      <CustomIcon
        className={`${styles.icon} ${
          changeIndx === 0 ? styles.inactivate : ''
        }`}
        onClick={handleArrowClick(1)}
        type='icon-arrow-right'
      />
      {/* <CustomIcon
        className={styles.icon}
        onClick={handleRefreshClick}
        type='icon-refresh'
      /> */}
      <Dropdown
        visible={visible && !!suggests}
        overlay={<div>{Suggests}</div>}
        placement='bottomLeft'
      >
        <Search
          className={styles.searchInput}
          value={text}
          size='small'
          placeholder='搜索'
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleInputChange}
          onPressEnter={handlePressEnter}
          onSearch={handleSearchClick}
          style={{ width: 200 }}
        />
      </Dropdown>
    </div>
  );
};

export default NavBar;
