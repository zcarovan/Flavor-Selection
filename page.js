"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import List from '@mui/material/List';

export default function Home() {

  // A list of ice cream flavors (not selected)
  const [flavorList, setFlavorList] = useState([
    { id: 1, name: 'Cherry Vanilla' },
    { id: 2, name: 'Chocolate Orange' },
    { id: 3, name: 'Dark Chocolate Orange' },
    { id: 4, name: 'Dark Chocolate Sea Salt' },
    { id: 5, name: 'Raspberry' },
    { id: 6, name: 'Mango' },
    { id: 7, name: 'Vanilla' },
    { id: 8, name: 'Coffee' },
    { id: 9, name: 'Dark Chocolate Peppermint' },
    { id: 10, name: 'Cherry' },
    { id: 11, name: 'Mint Chocolate Chip' },
    { id: 12, name: 'Coconut' },
  ]);

  // A list of Today's Flavors (selected).
  const [selectedFlavorList, setSelectedFlavorList] = useState([])

  // A list of Today's Flavors (published/saved).
  const [displayList, setDisplayList] = useState([]);

  return (
    <div className={styles.page}>
      <h2>Edit Flavors</h2>
      <main className={styles.main}>
        <ListContainer>
          <FlavorSelection 
            list1Items={flavorList}
            setList1Items={setFlavorList}
            list2Items={selectedFlavorList}
            setList2Items={setSelectedFlavorList}>
          </FlavorSelection>
        </ListContainer>
        <PublishButton
          list2Items={selectedFlavorList}
          setDisplayList={setDisplayList}
        >
        </PublishButton>
        <NightlyResetButton
          list1Items={flavorList}
          list2Items={selectedFlavorList}
          setList1Items={setFlavorList}
          setList2Items={setSelectedFlavorList}
          setDisplayList={setDisplayList}
        >
        </NightlyResetButton>
        <PublishList
          displayList={displayList}
        >
        </PublishList>
      </main>
    </div>
  );
}

// Container for flavor selection elements.
function ListContainer(props) {
  return (
    <Container style={{
      width: '50vw',
      height: '50vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'stretch',
      border: '1px solid gray',
      padding: '0px',
      backgroundColor: 'rgba(59, 59, 59, 0.5)' 
    }}>
      {props.children}
    </Container>
  )
};

// A component to render each individual list item.
const ListItem = ({ item, onClickHandler, listType }) => (
  <div style={{ padding: '10px', 
    border: '1px solid #ccc', 
    margin: '5px', 
    cursor: 'pointer' }}>
    <Button onClick={() => onClickHandler(item.id, listType)}>
      {item.name}
    </Button>
  </div>
);

// Contains both areas for unselected and selected flavors with search capabilities.
function FlavorSelection({list1Items, setList1Items, list2Items, setList2Items}) {

  const [searchTerm, setSearchTerm] = useState('');

  // Filters List 1 based on search term.
  const filteredItems = list1Items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handles search input changes.
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Moves an item between lists.
  const moveItem = (itemId, currentListType) => {
    if (currentListType === 'list1') {
      const itemToMove = list1Items.find(item => item.id === itemId);
      const newList1 = list1Items.filter(item => item.id !== itemId);
      const newList2 = [...list2Items, itemToMove];

      setList1Items(newList1);
      setList2Items(newList2);
    } else {
      const itemToMove = list2Items.find(item => item.id === itemId);
      const newList2 = list2Items.filter(item => item.id !== itemId);
      const newList1 = [...list1Items, itemToMove];

      setList2Items(newList2);
      setList1Items(newList1);
    }
  };

  return (
    <Container style={{ padding: '0px'}}>
      <input
        type="text"
        placeholder="Search for flavors..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{
          width: '100%',
          height: '10%'
        }}
      />
      <Container style={{ 
        width: '100%',
        height: '90%', 
        padding: '0px', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch'}}>
        <List sx={{width: '100%', 
          height: '100%', 
          padding:'0', 
          overflowY: 'scroll', 
          borderRight: '1px solid gray' }}>
          {filteredItems.map(item => (
              <ListItem
                key={item.id}
                item={item}
                onClickHandler={moveItem}
                listType="list1"
              >
              </ListItem>
            ))}    
        </List>
        <List sx={{width: '100%', 
          height: '100%', 
          padding:'0', 
          overflowY: 'scroll' }}>
          {list2Items.map(item => (
            <ListItem 
              key={item.id} 
              item={item} 
              onClickHandler={moveItem} 
              listType="list2" 
            />
          ))}
          </List>
        </Container>
    </Container>
  );
}


// Button which publishes the Flavors of the Day.
function PublishButton({list2Items, setDisplayList}) {
  const snapshotList = list2Items;

  // Updates published Flavor List.
  const updateFlavorList = () => {
    setDisplayList(snapshotList);
  };

  return <Button
    onClick={updateFlavorList}>
        Update
  </Button>
}

// List of published Flavors of the Day.
function PublishList({displayList}) {
  return <div>
            {displayList.map((item) => (
            <li key={item.id}>
              <strong>{item.name}</strong>
            </li>
          ))}
        </div>
}

// Button which simulates a flavor selection reset every night at midnight.
function NightlyResetButton({list1Items, list2Items, setList1Items, setList2Items, setDisplayList}) {

  const nightlyReset = () => {
    const newList1 = [...list2Items, ...list1Items];
    setList1Items(newList1);
    setList2Items([]);
    setDisplayList([]);
  };

  return <Button
    onClick={nightlyReset}>
        Nightly Reset
  </Button>
}
