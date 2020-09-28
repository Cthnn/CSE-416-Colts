import React from 'react';

class SourcesScreen extends React.Component {
    render() {
        return (
            <div>
                <div className="container">
                    <form onSubmit = {this.handleSubmit} className="white"> 
                        <h5 className="grey-text text-darken-3">About</h5>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis aspernatur molestias laboriosam magnam voluptates, soluta tempore qui? Amet tempora reprehenderit enim, cum veritatis sapiente? Odit quas quasi laborum sapiente enim.</div>
                    </form>
                </div>
            </div>
          
        );
      }
}

export default SourcesScreen