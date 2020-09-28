import React from 'react';

class AboutScreen extends React.Component {
    render() {
        return (
            <div>
                <div className="container">
                    <form onSubmit = {this.handleSubmit} className="white"> 
                        <h5 className="grey-text text-darken-3">Sources</h5>
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, quos? Debitis commodi enim beatae accusantium nulla quod non fugiat molestiae placeat iste repudiandae consequuntur temporibus est, vitae sint sed voluptas!</div>
                    </form>
                </div>
            </div>
          
        );
      }
}

export default AboutScreen