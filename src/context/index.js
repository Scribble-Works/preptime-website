import React, { Component, createContext } from 'react';

export const appContext = createContext();

class AppContextProvider extends Component {
    state = {
        location: null,
        datacollection:  {}
    }

    setLocation = (newLocation) => {
        this.setState({
            location: newLocation
        })
    }

    setDataCollection =  (data) => {
        this.setState(prevState => ({
            ...prevState,
            ...data
        }))
    }

    render() {
        return (
            <appContext.Provider value={{
                ...this.state,
                setLocation: this.setLocation,
                setDataCollection:  this.setDataCollection
            }}>
                { this.props.children }
            </appContext.Provider>
        )
    }
}

export default AppContextProvider;