import React, {useState,useEffect} from 'react';
import {Input, Row, Card, CardImg, CardBody, CardTitle, CardText, CardSubtitle, 
        Button, Badge} from 'reactstrap';
import api from '../api/api';
import Header from './Header';
import AddCards from './AddCards';
import EditCards from './EditCards';


const ManageCards = () => {

    const [cards, setCards] = useState([]);
    const [search, setSearch] = useState('');
    const [searchedCards, setSearchedCards] = useState([]);
    // const [filteredCards, setFilteredCards] = useState([]);

    //Retrieve Cards Data
    const retrieveCards = async () => {
        const response = await api.get('/cards');
        return response.data.cards;
    }

    useEffect(() => {
        const getAllCards = async () => {
            const allCards = await retrieveCards();
            if(allCards) {
                setCards(allCards);
            };
        };

        getAllCards();
    }, []);


    //Add a card
    const addCard = async (card) => {   
        const request = {
            ...card
        };
        // console.log(request);
        const response = await api.post('/cards', request);
        setCards([...cards, response.data]);
        // setSearchedCards([...searchedCards, response.data]);
    };


    //Edit the card
    const editCard = async (card) => {
        const response = await api.put(`/cards`, card);
        const {id} = response.data;
        setCards(cards.map( card => {
            return card.id===id ? {...response.data} : card;
        }));
        // setSearchedCards(searchedCards.map( scard => {
        //     return scard.id===id ? {...response.data} : scard;
        // }));
    };


    //Delete a card
    const deleteCard = async (id) => {
        await api.delete(`/cards?id=${id}`);

        setCards(cards.filter( card => card.id !== id));
        // setSearchedCards(searchedCards.filter( scard => scard.id !== id));
    };


    // Search Cards
    useEffect( () => {
        setSearchedCards(
            cards.filter( card => {
                return card.name.toLowerCase().includes(search.toLowerCase()) || card.description.toLowerCase().includes(search.toLowerCase())
            })
        )
    }, [search, cards]);


    // Filter Cards
    // const filterButton = (button) => {
    //     const filtered = cards.filter(card => card.type===button);
    //     setFilteredCards(filtered);
    // }


    function RenderEventCard({card, onDelete}){
        return(
            <div className="container">
                <Card>
                    <span><Badge color="info">{card.price}</Badge></span>
                    <CardImg top src={card.image} alt="Invitation Card" />
                    <CardBody>
                        <CardTitle tag="h5">{card.name} </CardTitle>
                        <CardSubtitle tag="h6" className="mb-2 text-muted">{card.type} {card.new ? <span><Badge pill color="danger">New</Badge></span>:<div></div>}</CardSubtitle>
                        <CardText style={{minHeight:'80px'}}>{card.description}</CardText>
                        <EditCards onEdit={editCard} card={card}/>{' '}
                        <Button className="btn-sm bg-danger" block onClick={onDelete}>Delete</Button>
                    </CardBody>
                </Card>
            </div>
        );
    }


    const eventcard = searchedCards.map((card) => {     //Here we are mapping the filtered cards for the searching purposes
        return(
            <div key={card._id} className="col-sm-4 col-md-3">
                    <RenderEventCard card={card} onDelete={() => deleteCard(card._id)}/>
            </div>
        );
    });


    return(
        <div>
            <Header />
            <div className="container-fluid">
                <Row className="ml-auto">
                    <AddCards onAdd={addCard} />
                    <Input className="w-50 m-auto" 
                        type="search"
                        placeholder="Search"
                        onChange={e => setSearch(e.target.value)} />
                    {/* <ButtonGroup className="m-auto">
                        <Button color="info" onClick={() => filterButton("Conference Invitation")}>Conference Cards</Button>
                        <Button color="info" onClick={() => filterButton("Wedding Invitation")}>Wedding Cards</Button>
                    </ButtonGroup>                 */}
                </Row>
                <div className="row">
                    { cards.length > 0 ? eventcard : 'No cards to show'}
                </div>
            </div>
        </div>
    );
}

export default ManageCards;