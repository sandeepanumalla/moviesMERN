import React, { useEffect, useState, useRef } from 'react'
import './Landingpage.css';
import { Typography, Row, Spin } from 'antd';
import { API_URL, API_KEY, IMAGE_BASE_URL, IMAGE_SIZE, POSTER_SIZE } from '../../Config'
import MainImage from './Sections/MainImage'
import GridCard from '../../commons/GridCards'
import SearchMenu from '../LandingPage/Sections/SearchMenu'
import { connect, useStore } from 'react-redux';
const { Title } = Typography;


function LandingPage(props) {
    const store = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    console.log("searchIitialTerm = " + searchTerm);
    const [typingStatus,settypingStatus] = useState(false);
    const buttonRef = useRef(null);

    const [Movies, setMovies] = useState([]);
    const [searchMovies,setSearchMovies] = useState([]);
    const [searchbackrop_path,setsearchbackrop_path] = useState({
        imagePath:"",
        orginal_title:"",
        overview:"",
        movieId:""
    }); 
    const [searchPath,setSearchPath] = useState([]);
    const [MainMovieImage, setMainMovieImage] = useState(null)
    const [Loading, setLoading] = useState(true)
    const [CurrentPage, setCurrentPage] = useState(0)
    const [counts, setcounts] = useState({
        total_pages: 500,
        total_results: 10000
    });
   // const [pageCount, setPageCount] = useState(1);
    const hasNext = counts.total_pages>CurrentPage; 


    const {imagePath,orginal_title,overview} = searchbackrop_path

    console.log(props.SearchMenu);
    console.log("searchTermLanding = " + searchTerm);
    var path;
    var loadpath; 
    
     
        if (props.results.status === false) {

            path = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${props.results.s.searchTerm}&page=1`;  
              
            loadpath = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${props.results.s.searchTerm}&page=${CurrentPage+1}`;  
        
        }
        else if (searchTerm == '') {
            
            path = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
            
            loadpath = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${CurrentPage+1}`;                            
        
        }

    
    console.log("path = "+path);
    console.log("loadpath = "+loadpath);


    function reset () {
        setMainMovieImage(null)
       return  setMovies([])
    }


    useEffect(() => {
        const endpoint = path;
        console.log("endpoint path changed..");
        if(props.results.status == 'initial_result'){
            fetchMovies(endpoint)
        }
        else if(props.results.status){
            reset();
            setLoading(true);
        }
        else if(props.results.status === false){
            setLoading(false);
            reset();
            fetchMovies(props.results.s.request)
        }

    }, [path,props.results])
    console.log('props',props.results);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
    }, [])


    const fetchMovies = (endpoint) => {
  
        fetch(endpoint)
        .then((result) => result.json())
        .then((result) => {
            
            setMovies([...Movies, ...result.results])
            setMainMovieImage(MainMovieImage || result.results[0])
            setCurrentPage(result.page)
            setcounts({
                total_pages: result.total_pages,
                total_results: result.total_results
            });
            console.log("movies Fetched from path: ",endpoint);
            console.log("movies Fetched :-------------->> ",result);
        }, 
        setLoading(false))
        .catch(error => {
            if(error){
                setLoading(true);
            }
            console.error('Error:', error)})
    }
    console.log("total pages for this result is==>> "+counts.total_pages); 
    console.log("pageNumber= "+CurrentPage+" and hasNExt value= "+hasNext);

    console.log( Movies);

    const loadMoreItems = () => {
        console.log("CurrentPage in LOADMORE= "+CurrentPage+" and total pages^^^^^^ "+counts.total_pages);
        let endpoint = '';
        if (hasNext) {
        
        setLoading(true)
        
        console.log('CurrentPage', CurrentPage)
        console.log('loadpath', loadpath);

            endpoint = loadpath;
        
        fetchMovies(endpoint);
        }
    }

    const handleScroll = () => {

        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        console.log("CurrentPage in handleScroll= "+CurrentPage+" and total pages=????? "+counts.total_pages);
        if (hasNext && windowBottom >= docHeight - 1) {
            // loadMoreItems()
            console.log("InHandleScroll..hasNext =>>>>> "+hasNext);
            console.log('clicked')
            buttonRef.current.click();
        }
    }

   
    
    useEffect(() => {
      
        fetch(searchPath)
        .then(response => response.json())
        .then(data =>{ 

            console.log('data',data.results)
            if(data.results.length > 0){
                setsearchbackrop_path({imagePath:data.results[0].backdrop_path,
                    orginal_title:data.results[0].original_title,overview:data.results[0].overview,
                movieId:data.results[0].id})
                return setSearchMovies(data.results);
            }
           
        });
    },[props.results])

    return (
        <div>
        { 
            <div>

            <div style={{ width: '100%', margin: '0' }}>
                {MainMovieImage && 
                    <MainImage
                        image={`${IMAGE_BASE_URL}${IMAGE_SIZE}${MainMovieImage.backdrop_path}`}
                        title={MainMovieImage.original_title}
                        text={MainMovieImage.overview}
                        MovieId = {MainMovieImage.id}
                     />
                 }

                <div style={{ width: '85%', margin: '1rem auto' }}>

                <Title level={2} >                        
                    { props.results.status === false ? `Results for: ${props.results.s.searchTerm}` : "Latest movies"}
                </Title>
                    <hr />
                    <Row gutter={[16, 16]}>
                        {Movies && Movies.map((movie, index) => (
                            <React.Fragment key={index}>
                                <GridCard
                                    image={movie.poster_path ?
                                        `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`
                                        : null}
                                    movieId={movie.id}
                                    movieName={movie.title}
                                />
                            </React.Fragment>
                        ))}
                    </Row>

                     {
                        Loading &&
                        <div className="example">
                            <Spin />
                        </div>
                     }

                    <br />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {CurrentPage<counts.total_pages 
                        ? (
                            <button 
                                ref={buttonRef} 
                                className="loadMore" 
                                onClick={loadMoreItems}
                            >
                                Load More
                            </button>
                            )
                        : (
                            <div>
                                Showing {counts.total_results} of {counts.total_results} results
                            </div>
                            )
                                              
                    }                           
                        
                    </div>
                </div>

            </div>
            </div>   
        }
        </div>
    )
}

 const matchStateToProps = (state)=>{
    return {results: state.searchResult}
}

export default connect(matchStateToProps,null)(LandingPage)